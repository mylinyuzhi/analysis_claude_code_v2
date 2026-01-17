# Think Level (Thinking Mode) Implementation Analysis - Claude Code v2.1.7

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

---

## 1. Overview

The **Think Level** feature (also called "Thinking Mode" or "Extended Thinking") enables Claude to perform deeper reasoning before responding. Despite the name suggesting graduated levels, it is actually a **binary on/off system** with a fixed maximum budget.

### Key Design Decision: Binary vs Graduated

**What it does:** Toggle thinking mode on (31,999 tokens) or off (0 tokens).

**How it works:**
1. User can enable thinking via keyword, settings, or environment variable
2. When enabled, API request includes `thinking: {type: "enabled", budget_tokens: 31999}`
3. Claude uses the thinking budget for internal reasoning before generating response
4. Thinking content is streamed back as `thinking` or `redacted_thinking` blocks

**Why this approach:**
- Simplicity: Binary choice eliminates complexity of managing multiple budget tiers
- Maximum utility: When enabled, full budget is allocated for best reasoning capability
- Model-appropriate: Modern models (Sonnet-4+, Opus-4+) handle full budget efficiently

**Key insight:** The "high" vs "none" levels in the code refer only to UI styling (colors/shimmers), not actual thinking intensity.

### Core Constants

```javascript
// ============================================
// THINKING_TOKEN_LEVELS (sB0) - Token budget constants
// Location: chunks.68.mjs:3573-3576
// ============================================

// ORIGINAL (for source lookup):
sB0 = {
  ULTRATHINK: 31999,
  NONE: 0
}, Cz8 = /\bultrathink\b/gi

// READABLE (for understanding):
THINKING_TOKEN_LEVELS = {
  ULTRATHINK: 31999,  // Max thinking budget when enabled
  NONE: 0             // No thinking when disabled
}
ULTRATHINK_REGEX = /\bultrathink\b/gi  // Keyword detection pattern

// Mapping: sB0→THINKING_TOKEN_LEVELS, Cz8→ULTRATHINK_REGEX
```

---

## 2. Activation Methods

Think level can be enabled through four methods, in priority order:

### 2.1 Environment Variable Override (Highest Priority)

```javascript
// ============================================
// isThinkingEnabled (q91) - Main entry point for thinking state
// Location: chunks.68.mjs:3540-3547
// ============================================

// ORIGINAL (for source lookup):
function q91() {
  if (process.env.MAX_THINKING_TOKENS) return parseInt(process.env.MAX_THINKING_TOKENS, 10) > 0;
  let { settings: A } = kP();
  if (A.alwaysThinkingEnabled === !1) return !1;
  return wz8(B5())
}

// READABLE (for understanding):
function isThinkingEnabled() {
  // Priority 1: Environment variable override
  if (process.env.MAX_THINKING_TOKENS) {
    return parseInt(process.env.MAX_THINKING_TOKENS, 10) > 0;
  }

  // Priority 2: User settings explicit disable
  let { settings } = getUserSettings();
  if (settings.alwaysThinkingEnabled === false) {
    return false;
  }

  // Priority 3: Model capability check
  return isModelThinkingCapable(getCurrentModel());
}

// Mapping: q91→isThinkingEnabled, kP→getUserSettings, wz8→isModelThinkingCapable, B5→getCurrentModel
```

**Behavior:**
- `MAX_THINKING_TOKENS=0` → Disabled
- `MAX_THINKING_TOKENS=31999` → Enabled with custom budget
- Environment variable takes absolute precedence

### 2.2 User Settings Toggle

**Location:** chunks.137.mjs:696-709 (Config menu)

```javascript
// ============================================
// Thinking Mode Config Toggle - Settings UI
// Location: chunks.137.mjs:696-709
// ============================================

// ORIGINAL (for source lookup):
{
  id: "thinkingEnabled",
  label: "Thinking mode",
  value: y,
  type: "boolean",
  onChange(t) {
    GA((BA) => ({
      ...BA,
      thinkingEnabled: t
    })), pB("userSettings", {
      alwaysThinkingEnabled: t ? void 0 : !1
    }), l("tengu_thinking_toggled", {
      enabled: t
    })
  }
}

// READABLE (for understanding):
{
  id: "thinkingEnabled",
  label: "Thinking mode",
  value: currentThinkingState,
  type: "boolean",
  onChange(newValue) {
    // Update app state
    setAppState((prevState) => ({
      ...prevState,
      thinkingEnabled: newValue
    }));

    // Persist to settings
    // When enabled: set to undefined (use model default)
    // When disabled: explicitly set to false
    persistSettings("userSettings", {
      alwaysThinkingEnabled: newValue ? undefined : false
    });

    // Log telemetry
    logTelemetry("tengu_thinking_toggled", { enabled: newValue });
  }
}

// Mapping: GA→setAppState, pB→persistSettings, l→logTelemetry
```

**Settings Schema (chunks.90.mjs:1967):**
```javascript
alwaysThinkingEnabled: z.boolean().optional().describe(
  "When false, thinking is disabled. When absent or true, thinking is enabled automatically for supported models."
)
```

### 2.3 Keyword Detection ("ultrathink")

```javascript
// ============================================
// detectThinkingKeyword (CjA) - Parse user message for ultrathink
// Location: chunks.68.mjs:3513-3518
// ============================================

// ORIGINAL (for source lookup):
function CjA(A) {
  let Q = /\bultrathink\b/i.test(A);
  return {
    tokens: Q ? sB0.ULTRATHINK : sB0.NONE,
    level: Q ? "high" : "none"
  }
}

// READABLE (for understanding):
function detectThinkingKeyword(messageText) {
  let hasUltrathink = /\bultrathink\b/i.test(messageText);
  return {
    tokens: hasUltrathink ? THINKING_TOKEN_LEVELS.ULTRATHINK : THINKING_TOKEN_LEVELS.NONE,
    level: hasUltrathink ? "high" : "none"  // Level affects UI styling only
  };
}

// Mapping: CjA→detectThinkingKeyword, A→messageText, Q→hasUltrathink, sB0→THINKING_TOKEN_LEVELS
```

**Recognized patterns:**
- "ultrathink" (case insensitive)
- Word boundary matching (`\b`) prevents false positives

### 2.4 Model-Based Auto-Enable

```javascript
// ============================================
// isModelThinkingCapable (wz8) - Check if model supports thinking
// Location: chunks.68.mjs:3533-3538
// ============================================

// ORIGINAL (for source lookup):
function wz8(A) {
  let Q = R4();
  if (Q === "foundry" || Q === "firstParty") return !A.toLowerCase().includes("claude-3-");
  let B = A.toLowerCase();
  return B.includes("sonnet-4") || B.includes("opus-4")
}

// READABLE (for understanding):
function isModelThinkingCapable(modelName) {
  let provider = getProvider();

  // For Foundry/FirstParty: all non-Claude-3 models support thinking
  if (provider === "foundry" || provider === "firstParty") {
    return !modelName.toLowerCase().includes("claude-3-");
  }

  // For other providers: only Sonnet-4+ and Opus-4+ support thinking
  let lowerModel = modelName.toLowerCase();
  return lowerModel.includes("sonnet-4") || lowerModel.includes("opus-4");
}

// Mapping: wz8→isModelThinkingCapable, A→modelName, R4→getProvider
```

**Supported models:**
- Claude Sonnet 4, 4.5
- Claude Opus 4, 4.5
- Claude Haiku 4 (via sonnet-4 check in some paths)

---

## 3. Token Budget Calculation

### 3.1 Main Budget Calculator

```javascript
// ============================================
// calculateMaxThinkingTokens (Hm) - Compute thinking budget for API call
// Location: chunks.68.mjs:3466-3476
// ============================================

// ORIGINAL (for source lookup):
function Hm(A, Q) {
  if (process.env.MAX_THINKING_TOKENS) {
    let B = parseInt(process.env.MAX_THINKING_TOKENS, 10);
    if (B > 0) l("tengu_thinking", {
      provider: PT(),
      tokenCount: B
    });
    return B
  }
  return Math.max(...A.filter((B) => B.type === "user" && !B.isMeta).map(qz8), Q ?? 0)
}

// READABLE (for understanding):
function calculateMaxThinkingTokens(messages, defaultTokens) {
  // Priority 1: Environment variable override
  if (process.env.MAX_THINKING_TOKENS) {
    let budget = parseInt(process.env.MAX_THINKING_TOKENS, 10);
    if (budget > 0) {
      logTelemetry("tengu_thinking", {
        provider: getProvider(),
        tokenCount: budget
      });
    }
    return budget;
  }

  // Priority 2: Extract max from message metadata
  // Filter to non-meta user messages, extract thinking tokens from each
  return Math.max(
    ...messages
      .filter((msg) => msg.type === "user" && !msg.isMeta)
      .map(extractThinkingFromMessage),
    defaultTokens ?? 0
  );
}

// Mapping: Hm→calculateMaxThinkingTokens, A→messages, Q→defaultTokens, qz8→extractThinkingFromMessage, PT→getProvider
```

### 3.2 Message-Level Extraction

```javascript
// ============================================
// extractThinkingFromMessage (qz8) - Get thinking tokens from message metadata
// Location: chunks.68.mjs:3482-3506
// ============================================

// ORIGINAL (for source lookup):
function qz8(A) {
  if (A.isMeta) return 0;
  if (A.thinkingMetadata) {
    let { level: G, disabled: Z } = A.thinkingMetadata;
    if (Z) return 0;
    let Y = Uz8(G);
    if (Y > 0) l("tengu_thinking", { provider: PT(), tokenCount: Y });
    return Y
  }
  let Q = Nz8(A),
    { tokens: B } = CjA(Q);
  if (B > 0) l("tengu_thinking", { provider: PT(), tokenCount: B });
  return B
}

// READABLE (for understanding):
function extractThinkingFromMessage(message) {
  // Skip meta messages
  if (message.isMeta) return 0;

  // Check explicit thinking metadata first
  if (message.thinkingMetadata) {
    let { level, disabled } = message.thinkingMetadata;
    if (disabled) return 0;
    let tokens = thinkingLevelToTokens(level);
    if (tokens > 0) {
      logTelemetry("tengu_thinking", { provider: getProvider(), tokenCount: tokens });
    }
    return tokens;
  }

  // Fall back to keyword detection in message content
  let messageText = getMessageTextContent(message);
  let { tokens } = detectThinkingKeyword(messageText);
  if (tokens > 0) {
    logTelemetry("tengu_thinking", { provider: getProvider(), tokenCount: tokens });
  }
  return tokens;
}

// Mapping: qz8→extractThinkingFromMessage, Uz8→thinkingLevelToTokens, Nz8→getMessageTextContent, CjA→detectThinkingKeyword
```

### 3.3 Model-Specific Maximum Budgets

```javascript
// ============================================
// getModelMaxThinkingTokens (o5A) - Model-specific budget caps
// Location: chunks.1.mjs:2240-2252
// ============================================

// ORIGINAL (for source lookup):
function o5A(A) {
  let Q = A.toLowerCase(), B;
  if (Q.includes("3-5")) B = 8192;
  else if (Q.includes("claude-3-opus")) B = 4096;
  else if (Q.includes("claude-3-sonnet")) B = 8192;
  else if (Q.includes("claude-3-haiku")) B = 4096;
  else if (Q.includes("opus-4-5")) B = 64000;
  else if (Q.includes("opus-4")) B = 32000;
  else if (Q.includes("sonnet-4") || Q.includes("haiku-4")) B = 64000;
  else B = FT9;  // Default: 32000
  return B
}

// READABLE (for understanding):
function getModelMaxThinkingTokens(modelName) {
  let model = modelName.toLowerCase();
  let maxTokens;

  if (model.includes("3-5")) maxTokens = 8192;
  else if (model.includes("claude-3-opus")) maxTokens = 4096;
  else if (model.includes("claude-3-sonnet")) maxTokens = 8192;
  else if (model.includes("claude-3-haiku")) maxTokens = 4096;
  else if (model.includes("opus-4-5")) maxTokens = 64000;   // Highest
  else if (model.includes("opus-4")) maxTokens = 32000;
  else if (model.includes("sonnet-4") || model.includes("haiku-4")) maxTokens = 64000;
  else maxTokens = DEFAULT_MAX_THINKING_TOKENS;  // 32000

  return maxTokens;
}

// Mapping: o5A→getModelMaxThinkingTokens, FT9→DEFAULT_MAX_THINKING_TOKENS (32000)
```

**Model Budget Summary:**

| Model Family | Max Thinking Tokens |
|--------------|---------------------|
| Claude 3 Haiku | 4,096 |
| Claude 3 Opus | 4,096 |
| Claude 3 Sonnet | 8,192 |
| Claude 3.5 | 8,192 |
| Claude 4 Opus | 32,000 |
| Claude 4 Sonnet/Haiku | 64,000 |
| Claude 4.5 Opus | 64,000 |

---

## 4. API Integration

### 4.1 Thinking Object in API Requests

```javascript
// ============================================
// API Request Building - Thinking configuration
// Location: chunks.147.mjs:95-98
// ============================================

// ORIGINAL (for source lookup):
let ZA = B > 0 ? {
  budget_tokens: OA,
  type: "enabled"
} : void 0

// READABLE (for understanding):
// Build thinking configuration object
let thinkingConfig = maxThinkingTokens > 0 ? {
  budget_tokens: effectiveBudget,  // May be capped by maxTokensOverride
  type: "enabled"
} : undefined;  // No thinking object when disabled

// This is then included in the API request as `thinking: thinkingConfig`

// Mapping: ZA→thinkingConfig, B→maxThinkingTokens, OA→effectiveBudget
```

### 4.2 Main Loop Integration

```javascript
// ============================================
// API Options with Thinking - Main query setup
// Location: chunks.154.mjs:1063
// ============================================

// ORIGINAL (for source lookup):
maxThinkingTokens: B4 ?? (L.thinkingEnabled ? Hm(JQ, void 0) : 0),

// READABLE (for understanding):
maxThinkingTokens: providedThinkingTokens ?? (
  userSettings.thinkingEnabled
    ? calculateMaxThinkingTokens(messageHistory, undefined)
    : 0
),

// Mapping: B4→providedThinkingTokens, L→userSettings, Hm→calculateMaxThinkingTokens, JQ→messageHistory
```

### 4.3 Token Counting API

```javascript
// ============================================
// countTokens API with Thinking - Include thinking in token estimation
// Location: chunks.85.mjs:723-728
// ============================================

// ORIGINAL (for source lookup):
...Z ? {
  thinking: {
    type: "enabled",
    budget_tokens: jZ0  // 1024
  }
} : {}

// READABLE (for understanding):
// When counting tokens for messages containing thinking blocks,
// include thinking configuration to get accurate estimate
...containsThinkingContent ? {
  thinking: {
    type: "enabled",
    budget_tokens: DEFAULT_THINKING_BUDGET  // 1024 for counting
  }
} : {}

// Mapping: Z→containsThinkingContent, jZ0→DEFAULT_THINKING_BUDGET
```

### 4.4 Streaming Response Handling

```javascript
// ============================================
// Thinking Block Streaming - Handle thinking events
// Location: chunks.147.mjs:206-210
// ============================================

// ORIGINAL (for source lookup):
case "thinking":
  n[s.index] = {
    ...s.content_block,
    thinking: ""
  };
  break;

// READABLE (for understanding):
// Handle content_block_start for thinking type
case "thinking":
  contentBlocks[event.index] = {
    ...event.content_block,
    thinking: ""  // Initialize empty thinking content
  };
  break;

// Mapping: n→contentBlocks, s→event
```

Thinking delta events (chunks.147.mjs:257-264):
- `thinking_delta` events accumulate thinking content
- Thinking content displayed in UI during streaming
- Final thinking block preserved in message history

---

## 5. Cross-Module Interactions

### 5.1 Tools - Compact Filtering

**Critical integration:** Thinking blocks are filtered out during compaction to avoid bloating context.

```javascript
// ============================================
// filterCompactableMessages (UG7) - Remove thinking blocks during compact
// Location: chunks.135.mjs:694-712
// ============================================

// ORIGINAL (for source lookup):
function UG7(A) {
  let Q = (Y) => typeof Y === "object" && Y !== null && Y.type === "tool_result" && typeof Y.tool_use_id === "string",
    B = (Y) => !Y.is_error && !(typeof Y.content === "string" && Y.content.includes(vN)),
    G = new Set(A.filter(h19).flatMap((Y) => Y.message.content).filter(Q).filter(B).map((Y) => Y.tool_use_id)),
    Z = (Y) => Y.type !== "thinking" && Y.type !== "redacted_thinking" && !(Y.type === "tool_use" && !G.has(Y.id)) && !(Y.type === "tool_result" && !G.has(Y.tool_use_id));
  return A.map((Y) => {
    if (!("message" in Y) || !Array.isArray(Y.message.content)) return Y;
    let J = Y.message.content.filter(Z);
    if (J.length === Y.message.content.length) return Y;
    if (J.length === 0) return null;
    return { ...Y, message: { ...Y.message, content: J } }
  }).filter((Y) => Y !== null)
}

// READABLE (for understanding):
function filterCompactableMessages(messages) {
  // Build set of valid tool_use_ids (successful tool results)
  let isToolResult = (block) => typeof block === "object" && block !== null &&
    block.type === "tool_result" && typeof block.tool_use_id === "string";
  let isSuccessfulResult = (block) => !block.is_error &&
    !(typeof block.content === "string" && block.content.includes(COMPACTED_MARKER));

  let validToolResultIds = new Set(
    messages
      .filter(isUserMessage)
      .flatMap((msg) => msg.message.content)
      .filter(isToolResult)
      .filter(isSuccessfulResult)
      .map((toolResult) => toolResult.tool_use_id)
  );

  // KEY FILTER: Exclude thinking blocks and orphaned tool references
  let shouldKeepBlock = (block) =>
    block.type !== "thinking" &&               // EXCLUDE thinking
    block.type !== "redacted_thinking" &&      // EXCLUDE redacted_thinking
    !(block.type === "tool_use" && !validToolResultIds.has(block.id)) &&
    !(block.type === "tool_result" && !validToolResultIds.has(block.tool_use_id));

  return messages
    .map((msg) => {
      if (!("message" in msg) || !Array.isArray(msg.message.content)) return msg;
      let filteredContent = msg.message.content.filter(shouldKeepBlock);
      if (filteredContent.length === msg.message.content.length) return msg;
      if (filteredContent.length === 0) return null;  // Drop empty messages
      return { ...msg, message: { ...msg.message, content: filteredContent } };
    })
    .filter((msg) => msg !== null);
}

// Mapping: UG7→filterCompactableMessages, h19→isUserMessage, vN→COMPACTED_MARKER
```

**Key insight:** Thinking content is intentionally discarded during compaction because:
1. It's internal reasoning, not essential for conversation continuity
2. It can be very large (up to 64K tokens)
3. The final response captures the essence of the reasoning

### 5.2 Skills - Override Mechanism

Skills can override the default `maxThinkingTokens` for specialized execution contexts.

```javascript
// ============================================
// Skill Override for Thinking Tokens
// Location: chunks.113.mjs:878-956
// ============================================

// ORIGINAL (for source lookup):
let W = await MP2(X, Q || "", I, B);
// ...
let F = W.maxThinkingTokens;
// ...
if (F !== void 0) j = {
  ...j,
  options: {
    ...j.options,
    maxThinkingTokens: F
  }
};

// READABLE (for understanding):
let skillResult = await processSkillCommand(skillName, userInput, commands, context);
let overrideThinkingTokens = skillResult.maxThinkingTokens;

// If skill specifies custom thinking tokens, apply the override
if (overrideThinkingTokens !== undefined) {
  contextModifier = {
    ...contextModifier,
    options: {
      ...contextModifier.options,
      maxThinkingTokens: overrideThinkingTokens
    }
  };
}

// Mapping: MP2→processSkillCommand, W→skillResult, F→overrideThinkingTokens
```

### 5.3 Plan Mode - Resource Notification

When thinking is disabled but resources are attached, plan mode suggests enabling it.

```javascript
// ============================================
// Plan Mode Thinking Suggestion
// Location: chunks.152.mjs:2180-2188
// ============================================

// ORIGINAL (for source lookup):
if (RB.length && !FA.thinkingEnabled) F9({
  message: "Resources are attached. Enable thinking for better analysis",
  type: "info"
});

// READABLE (for understanding):
if (attachedResources.length && !appState.thinkingEnabled) {
  showNotification({
    message: "Resources are attached. Enable thinking for better analysis",
    type: "info"
  });
}

// Mapping: RB→attachedResources, FA→appState, F9→showNotification
```

### 5.4 System Prompts - Joint Configuration

Thinking tokens are sent alongside system prompts in the same API call.

```javascript
// ============================================
// API Call with System Prompt and Thinking
// Location: chunks.146.mjs:3002-3028
// ============================================

// Function signature shows both are passed together
async function callModelWithThinking({
  messages,
  systemPrompt,      // System prompt content
  maxThinkingTokens, // Thinking budget
  tools,
  signal,
  options
}) {
  // Both sent in same API request
  yield* buildAndCallAnthropicAPI(messages, systemPrompt, maxThinkingTokens, tools, signal, options);
}
```

---

## 6. Interleaved Thinking Support

### 6.1 Feature Flags

```javascript
// ============================================
// Interleaved Thinking Beta Flags
// Location: chunks.1.mjs:2207-2228
// ============================================

// ORIGINAL (for source lookup):
$b0 = "interleaved-thinking-2025-05-14"
// ...
lU1 = new Set(["interleaved-thinking-2025-05-14", "context-1m-2025-08-07", "tool-search-tool-2025-10-19", "tool-examples-2025-10-29"])
iU1 = new Set(["claude-code-20250219", "interleaved-thinking-2025-05-14", "fine-grained-tool-streaming-2025-05-14", "context-management-2025-06-27"])

// READABLE (for understanding):
INTERLEAVED_THINKING_BETA = "interleaved-thinking-2025-05-14"

// Beta flags that enable interleaved thinking
INTERLEAVED_THINKING_BETAS = new Set([
  "interleaved-thinking-2025-05-14",      // Core interleaved thinking
  "context-1m-2025-08-07",                // Extended context
  "tool-search-tool-2025-10-19",          // Tool search
  "tool-examples-2025-10-29"              // Tool examples
])

// Models that support interleaved features
VERTEX_SUPPORTED_BETAS = new Set([
  "claude-code-20250219",
  "interleaved-thinking-2025-05-14",
  "fine-grained-tool-streaming-2025-05-14",
  "context-management-2025-06-27"
])

// Mapping: $b0→INTERLEAVED_THINKING_BETA, lU1→INTERLEAVED_THINKING_BETAS, iU1→VERTEX_SUPPORTED_BETAS
```

### 6.2 What Interleaved Thinking Enables

**Standard thinking flow:**
1. Model thinks (single block) →
2. Calls tool →
3. Receives result →
4. Generates response

**Interleaved thinking flow:**
1. Model thinks →
2. Calls tool →
3. **Model thinks again** →
4. Receives result →
5. **Model thinks more** →
6. Generates response

This allows the model to reason between tool calls, improving multi-step task handling.

---

## 7. UI Integration

### 7.1 Config Menu Toggle

**Location:** chunks.137.mjs:696-709

The `/config` command presents a boolean toggle for "Thinking mode" that:
- Updates app state (`thinkingEnabled`)
- Persists to user settings (`alwaysThinkingEnabled`)
- Logs telemetry event (`tengu_thinking_toggled`)

### 7.2 Thinking Status Display

```javascript
// ============================================
// Thinking Status Display - UI feedback
// Location: chunks.107.mjs:2269-2323
// ============================================

// ORIGINAL (for source lookup):
if (A === "thinking") {
  if (j.current === null) j.current = Date.now(), _("thinking")
} else if (j.current !== null) {
  let Q0 = Date.now() - j.current,
    b0 = Math.max(0, 2000 - (Date.now() - j.current));
  j.current = null;
  // Display duration with 2s minimum
}

let WA = M === "thinking" ? "thinking" : typeof M === "number" ? `thought for ${Math.max(1,Math.round(M/1000))}s` : null;

// READABLE (for understanding):
// Track when thinking started
if (spinnerMode === "thinking") {
  if (thinkingStartTime === null) {
    thinkingStartTime = Date.now();
    setThinkingDisplay("thinking");
  }
} else if (thinkingStartTime !== null) {
  let elapsedMs = Date.now() - thinkingStartTime;
  let delayBeforeClear = Math.max(0, 2000 - elapsedMs);  // 2s minimum display
  thinkingStartTime = null;
  // Show duration, clear after delay
}

// Format display text
let displayText = thinkingStatus === "thinking"
  ? "thinking"
  : typeof thinkingStatus === "number"
    ? `thought for ${Math.max(1, Math.round(thinkingStatus/1000))}s`
    : null;

// Mapping: j.current→thinkingStartTime, M→thinkingStatus, WA→displayText
```

**Display behavior:**
- While thinking: shows "thinking" with spinner
- After thinking: shows "thought for Ns" (minimum 2 seconds display)
- Duration calculation: `Math.max(1, Math.round(elapsedMs/1000))` seconds

### 7.3 Keyword Highlighting (Colors)

```javascript
// ============================================
// Thinking Level Colors - UI styling for ultrathink keyword
// Location: chunks.68.mjs:3567-3576
// ============================================

// ORIGINAL (for source lookup):
C91 = {
  none: "promptBorder",
  high: "claude"
}, kRB = {
  none: "promptBorderShimmer",
  high: "claudeShimmer"
}

// READABLE (for understanding):
THINKING_LEVEL_COLORS = {
  none: "promptBorder",      // Default border color
  high: "claude"             // Claude brand color when thinking enabled
}

THINKING_SHIMMER_COLORS = {
  none: "promptBorderShimmer",
  high: "claudeShimmer"      // Animated shimmer effect
}

// Mapping: C91→THINKING_LEVEL_COLORS, kRB→THINKING_SHIMMER_COLORS
```

Rainbow colors for keyword highlighting (chunks.68.mjs:3572):
```javascript
zz8 = ["rainbow_red", "rainbow_orange", "rainbow_yellow", "rainbow_green", "rainbow_blue", "rainbow_indigo", "rainbow_violet"]
$z8 = ["rainbow_red_shimmer", "rainbow_orange_shimmer", ...]  // Shimmer variants
```

---

## 8. Thinking Content Detection

### 8.1 Message Content Check

```javascript
// ============================================
// containsThinkingContent (leB) - Check if messages have thinking blocks
// Location: chunks.85.mjs:640-646
// ============================================

// ORIGINAL (for source lookup):
function leB(A) {
  for (let Q of A)
    if (Q.role === "assistant" && Array.isArray(Q.content)) {
      for (let B of Q.content)
        if (typeof B === "object" && B !== null && "type" in B && (B.type === "thinking" || B.type === "redacted_thinking")) return !0
    } return !1
}

// READABLE (for understanding):
function containsThinkingContent(messages) {
  for (let message of messages) {
    if (message.role === "assistant" && Array.isArray(message.content)) {
      for (let block of message.content) {
        if (typeof block === "object" && block !== null && "type" in block) {
          if (block.type === "thinking" || block.type === "redacted_thinking") {
            return true;
          }
        }
      }
    }
  }
  return false;
}

// Mapping: leB→containsThinkingContent
```

**Usage:** This function is used to:
1. Route responses to appropriate providers (Vertex/Bedrock handling)
2. Include thinking config in token counting API
3. Determine if special handling is needed for message history

---

## 9. Main Loop Integration

This section details how thinking flows through the main agent execution loop.

### 9.1 Entry Point - User Input Processing

```javascript
// ============================================
// processUserInputWithThinking (vH1) - User input processing with thinking metadata
// Location: chunks.134.mjs:2620-2642
// ============================================

// ORIGINAL (for source lookup):
async function vH1({
  input: A,
  mode: Q,
  thinkingMetadata: K,      // ← Thinking level/disabled flag
  manualThinkingTokens: V,  // ← Manual token override
  ...
})

let z = await Z.getAppState(),
    $ = await r77(A, Q, B, G, Z, Y, J, X, D, W, K, V, F, z.todos[Z.agentId ?? q0()], H);

// READABLE (for understanding):
async function processUserInputWithThinking({
  input: userInput,
  mode: inputMode,
  thinkingMetadata: thinkingConfig,      // Contains level: "high"/"none", disabled: bool
  manualThinkingTokens: overrideTokenBudget,
  ...
})

let appState = await sessionContext.getAppState();
let processedInput = await buildUserInputMessage(
  userInput, inputMode, ...,
  thinkingConfig,           // ← Pass thinking config to message builder
  overrideTokenBudget,      // ← Pass token override
  ...
);

// Mapping: vH1→processUserInputWithThinking, K→thinkingConfig, V→overrideTokenBudget, r77→buildUserInputMessage
```

### 9.2 User Message Building with Thinking Metadata

```javascript
// ============================================
// buildUserMessage - Attach thinking metadata and calculate budget
// Location: chunks.134.mjs:2582-2606
// ============================================

// ORIGINAL (for source lookup):
let H = H0({
  content: [...F, ...Q],
  uuid: Y,
  thinkingMetadata: J,  // ← From user input
  todos: I,
  imagePasteIds: B.length > 0 ? B : void 0
}),
E = Hm([H], X ?? void 0);  // ← Calculate max thinking tokens

return {
  messages: [H, ...G],
  shouldQuery: !0,
  maxThinkingTokens: E > 0 ? E : void 0  // ← Pass to API
}

// READABLE (for understanding):
let userMessage = createUserMessage({
  content: [...textContent, ...pastedContent],
  uuid: messageId,
  thinkingMetadata: userThinkingMetadata,  // Attached to message
  todos: todoList,
  imagePasteIds: imageIds.length > 0 ? imageIds : undefined
});

// Calculate thinking budget from all messages
let maxThinkingTokenBudget = calculateMaxThinkingTokens([userMessage], manualThinkingTokens);

return {
  messages: [userMessage, ...previousMessages],
  shouldQuery: true,
  maxThinkingTokens: maxThinkingTokenBudget > 0 ? maxThinkingTokenBudget : undefined
};

// Mapping: H0→createUserMessage, J→userThinkingMetadata, Hm→calculateMaxThinkingTokens, E→maxThinkingTokenBudget
```

### 9.3 Main Query Loop - Thinking Parameter Flow

```javascript
// ============================================
// mainQueryLoop (aN) - Core agent loop accepting thinking parameters
// Location: chunks.134.mjs:99-114
// ============================================

// ORIGINAL (for source lookup):
async function* aN({
  messages: A,
  systemPrompt: Q,
  userContext: B,
  systemContext: G,
  canUseTool: Z,
  toolUseContext: Y,  // Contains Y.options.maxThinkingTokens
  autoCompactTracking: J,
  fallbackModel: X,
  ...
})

// READABLE (for understanding):
async function* mainQueryLoop({
  messages,
  systemPrompt,
  userContext,
  systemContext,
  canUseTool,
  toolUseContext,      // ← Contains options.maxThinkingTokens
  autoCompactTracking,
  fallbackModel,
  ...
})

// Mapping: aN→mainQueryLoop, Y→toolUseContext
```

### 9.4 API Request Building with Thinking

```javascript
// ============================================
// API Request with Thinking - Passed to Anthropic API
// Location: chunks.134.mjs:202-206
// ============================================

// ORIGINAL (for source lookup):
for await (let wA of oHA({
  messages: _3A(z, B),
  systemPrompt: f,
  maxThinkingTokens: Y.options.maxThinkingTokens,  // ← Thinking budget
  tools: Y.options.tools,
  signal: Y.abortController.signal,
  options: { ... }
}))

// READABLE (for understanding):
for await (let apiEvent of apiStreamHandler({
  messages: normalizeMessages(processedMessages, userContext),
  systemPrompt: finalSystemPrompt,
  maxThinkingTokens: toolUseContext.options.maxThinkingTokens,  // ← From context
  tools: toolUseContext.options.tools,
  signal: toolUseContext.abortController.signal,
  options: { ... }
}))

// Mapping: oHA→apiStreamHandler, Y→toolUseContext, _3A→normalizeMessages
```

### 9.5 Thinking Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          MAIN LOOP THINKING FLOW                         │
└─────────────────────────────────────────────────────────────────────────┘

User Input (with thinkingMetadata)
       │
       ▼
┌──────────────────────────────────────┐
│  processUserInputWithThinking (vH1)  │
│  - thinkingMetadata: {level, disabled}│
│  - manualThinkingTokens: override    │
└──────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  buildUserMessage (r77)              │
│  - Attach thinkingMetadata to message│
│  - Call Hm() to calculate budget     │
└──────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  calculateMaxThinkingTokens (Hm)     │
│  1. Check MAX_THINKING_TOKENS env    │
│  2. Extract from message metadata    │
│  3. Detect ultrathink keyword        │
│  → Returns: 0 or 31999               │
└──────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  toolUseContext.options              │
│  { maxThinkingTokens: calculated }   │
└──────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  mainQueryLoop (aN)                  │
│  Receives toolUseContext             │
└──────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  apiStreamHandler (oHA)              │
│  { maxThinkingTokens: budget }       │
└──────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  Anthropic API Request               │
│  thinking: {                         │
│    type: "enabled",                  │
│    budget_tokens: 31999              │
│  }                                   │
└──────────────────────────────────────┘
```

---

## 10. Subagent Integration

This section details how thinking configuration is inherited and can be overridden in subagent execution.

### 10.1 Context Building for Subagent (UI Level)

```javascript
// ============================================
// buildToolUseContextForSubagent (WJ) - Creates context with inherited thinking
// Location: chunks.154.mjs:1054-1073
// ============================================

// ORIGINAL (for source lookup):
WJ = UQ.useCallback((R0, JQ, WQ, S9, B4, G4) => {
  return {
    abortController: WQ,
    options: {
      commands: L0,
      tools: A1,
      maxThinkingTokens: B4 ?? (L.thinkingEnabled ? Hm(JQ, void 0) : 0),  // KEY LINE
      mcpClients: zA,
      ...
    },
    ...
  }
}, [L0, A1, ..., L.thinkingEnabled, ...])

// READABLE (for understanding):
buildToolUseContext = useCallback((messages, allMessages, abortController, allowedCommands, explicitMaxThinkingTokens, model) => {
  return {
    abortController: abortController,
    options: {
      commands: commandsList,
      tools: toolsList,
      // CRITICAL: Thinking token inheritance
      maxThinkingTokens: explicitMaxThinkingTokens ?? (
        appState.thinkingEnabled
          ? calculateMaxThinkingTokens(allMessages, undefined)
          : 0
      ),
      mcpClients: mcpClients,
      ...
    },
    ...
  }
}, [appState.thinkingEnabled, /* deps */])

// Mapping: WJ→buildToolUseContext, B4→explicitMaxThinkingTokens, L.thinkingEnabled→appState.thinkingEnabled
```

**Key insight:** Subagent thinking inheritance logic:
1. If explicit `maxThinkingTokens` provided → use it (allows override)
2. Else if `thinkingEnabled` → calculate from all messages
3. Else → 0 (thinking disabled)

### 10.2 Task Tool - Passing Context to Subagent

```javascript
// ============================================
// Task Tool - Subagent execution with inherited thinking
// Location: chunks.113.mjs:147-160
// ============================================

// ORIGINAL (for source lookup):
x = {
  agentDefinition: z,
  promptMessages: O ? [...O, ..._] : _,
  toolUseContext: X,  // ← INHERITS THINKING FROM PARENT
  canUseTool: I,
  forkContextMessages: L,
  isAsync: Y === !0 && !nkA,
  model: G,
  maxTurns: J,
  ...
}

// READABLE (for understanding):
subagentExecutionRequest = {
  agentDefinition: selectedAgent,
  promptMessages: resumedMessages ? [...resumedMessages, ...promptMessages] : promptMessages,
  toolUseContext: parentToolUseContext,  // ← Carries maxThinkingTokens from parent
  canUseTool: toolPermissionChecker,
  forkContextMessages: forkMessages,
  isAsync: isBackgroundTask && !isDisabled,
  model: modelOverride,
  maxTurns: maxTurns,
  ...
}

// Mapping: X→parentToolUseContext, z→selectedAgent
```

### 10.3 Skill Tool - contextModifier for Thinking Override

```javascript
// ============================================
// Skill Tool contextModifier - Override thinking for skill execution
// Location: chunks.113.mjs:878-960
// ============================================

// ORIGINAL (for source lookup):
let W = await MP2(X, Q || "", I, B);
let F = W.maxThinkingTokens;  // Extract from skill command
...
return {
  data: { success: !0, commandName: X, ... },
  newMessages: O,
  contextModifier(_) {
    let j = _;
    if (F !== void 0) j = {
      ...j,
      options: { ...j.options, maxThinkingTokens: F }  // OVERRIDE
    };
    return j
  }
}

// READABLE (for understanding):
let commandResult = await processSkillCommand(skillName, skillArgs, commandList, appState);
let thinkingTokensFromSkill = commandResult.maxThinkingTokens;

return {
  data: { success: true, commandName: skillName, ... },
  newMessages: newMessagesFromSkill,
  contextModifier(context) {
    let modifiedContext = context;

    // Apply thinking token limit from skill
    if (thinkingTokensFromSkill !== undefined) {
      modifiedContext = {
        ...modifiedContext,
        options: {
          ...modifiedContext.options,
          maxThinkingTokens: thinkingTokensFromSkill  // ← Override parent's value
        }
      };
    }

    return modifiedContext;
  }
}

// Mapping: F→thinkingTokensFromSkill, MP2→processSkillCommand
```

### 10.4 Subagent Loop - Calculating Thinking Tokens

```javascript
// ============================================
// executeAgentLoop - Subagent setup with thinking calculation
// Location: chunks.112.mjs:3000-3028
// ============================================

// ORIGINAL (for source lookup):
let WA = {
  isNonInteractiveSession: Z ? !0 : B.options.isNonInteractiveSession ?? !1,
  tools: GA,
  commands: [],
  mainLoopModel: V,
  maxThinkingTokens: Hm(E),  // ← CALCULATE FOR SUBAGENT
  mcpClients: n,
  mcpResources: B.options.mcpResources,
  agentDefinitions: B.options.agentDefinitions
};

// READABLE (for understanding):
let optionsForSubagent = {
  isNonInteractiveSession: isSubagent ? true : parentConfig.isNonInteractiveSession ?? false,
  tools: allTools,
  commands: [],
  mainLoopModel: selectedModel,
  maxThinkingTokens: calculateMaxThinkingTokens(messages),  // ← Recalculate for subagent
  mcpClients: mcp_clients,
  mcpResources: parentConfig.mcpResources,
  agentDefinitions: parentConfig.agentDefinitions
};

// Mapping: Hm→calculateMaxThinkingTokens, E→messages, WA→optionsForSubagent
```

### 10.5 Context Inheritance Mechanism (lkA)

```javascript
// ============================================
// buildToolUseContext (lkA) - Core context inheritance
// Location: chunks.134.mjs:1918-1962
// ============================================

// ORIGINAL (for source lookup):
function lkA(A, Q) {
  return {
    readFileState: m9A(Q?.readFileState ?? A.readFileState),
    abortController: B,
    getAppState: G,
    options: Q?.options ?? A.options,  // ← INHERIT OPTIONS (including maxThinkingTokens)
    messages: Q?.messages ?? A.messages,
    agentId: Q?.agentId ?? LS(),
    queryTracking: { chainId: p77(), depth: (A.queryTracking?.depth ?? -1) + 1 },
    ...
  }
}

// READABLE (for understanding):
function buildToolUseContext(parentContext, overrides) {
  return {
    readFileState: copyFileReadState(overrides?.readFileState ?? parentContext.readFileState),
    abortController: abortController,
    getAppState: getAppStateFunction,
    // KEY: Options inheritance - includes maxThinkingTokens
    options: overrides?.options ?? parentContext.options,
    messages: overrides?.messages ?? parentContext.messages,
    agentId: overrides?.agentId ?? generateNewAgentId(),
    queryTracking: {
      chainId: generateNewChainId(),
      depth: (parentContext.queryTracking?.depth ?? -1) + 1
    },
    ...
  }
}

// Mapping: lkA→buildToolUseContext, A→parentContext, Q→overrides
```

### 10.6 Subagent Thinking Inheritance Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      SUBAGENT THINKING INHERITANCE                       │
└─────────────────────────────────────────────────────────────────────────┘

┌─ Parent Agent ─────────────────────────────────────────────┐
│                                                             │
│  thinkingEnabled: true  ←─── appState                      │
│  messages with thinkingMetadata                            │
│                                                             │
│  calculateMaxThinkingTokens(messages) → 31999              │
│         ↓                                                   │
│  toolUseContext.options.maxThinkingTokens = 31999          │
│                                                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
            ┌──────────────┴──────────────┐
            │                             │
     ┌──────▼──────────┐          ┌──────▼──────────┐
     │   Task Tool     │          │   Skill Tool    │
     └──────┬──────────┘          └──────┬──────────┘
            │                             │
      Pass toolUseContext         contextModifier can
      directly (inherit)          override maxThinkingTokens
            │                             │
            │                    ┌────────▼────────┐
            │                    │ maxThinkingTokens│
            │                    │ = skill.tokens   │
            │                    │ (e.g., 0, 31999) │
            │                    └────────┬────────┘
            │                             │
            └──────────────┬──────────────┘
                           │
                   ┌───────▼───────────────────┐
                   │  Subagent Loop (aN)       │
                   │  - Inherits/Uses override │
                   │  - Or recalculates via Hm │
                   │  maxThinkingTokens: 31999 │
                   └───────────────────────────┘
```

---

## 11. Compact/Restore Integration

This section details how thinking blocks are handled during conversation compaction and session restoration.

### 11.1 Thinking Block Type Checkers

```javascript
// ============================================
// isThinkingBlock (_J9) - Type checker
// Location: chunks.148.mjs:555-557
// ============================================

// ORIGINAL (for source lookup):
function _J9(A) {
  return A.type === "thinking" || A.type === "redacted_thinking"
}

// READABLE (for understanding):
function isThinkingBlock(contentBlock) {
  return contentBlock.type === "thinking" || contentBlock.type === "redacted_thinking"
}

// Mapping: _J9→isThinkingBlock
```

```javascript
// ============================================
// isThinkingOnlyMessage (dF1) - Check if message has only thinking content
// Location: chunks.148.mjs:511-515
// ============================================

// ORIGINAL (for source lookup):
function dF1(A) {
  if (A.type !== "assistant") return !1;
  if (!Array.isArray(A.message.content)) return !1;
  return A.message.content.every((Q) => Q.type === "thinking")
}

// READABLE (for understanding):
function isThinkingOnlyMessage(message) {
  if (message.type !== "assistant") return false;
  if (!Array.isArray(message.message.content)) return false;
  return message.message.content.every((block) => block.type === "thinking")
}

// Mapping: dF1→isThinkingOnlyMessage
```

### 11.2 Trailing Thinking Block Removal (Compact)

```javascript
// ============================================
// removeTrailingThinkingBlocks (w$7) - Clean up message endings
// Location: chunks.148.mjs:559-589
// ============================================

// ORIGINAL (for source lookup):
function w$7(A) {
  let Q = A[A.length - 1];
  if (!Q || Q.type !== "assistant") return A;
  let B = Q.message.content,
    G = B[B.length - 1];
  if (!G || !_J9(G)) return A;

  // Find last non-thinking block
  let Z = B.length - 1;
  while (Z >= 0) {
    let X = B[Z];
    if (!X || !_J9(X)) break;
    Z--
  }

  l("tengu_filtered_trailing_thinking_block", {
    messageUUID: Q.uuid,
    blocksRemoved: B.length - Z - 1,
    remainingBlocks: Z + 1
  });

  let Y = Z < 0 ? [{
    type: "text",
    text: "[No message content]",
    citations: []
  }] : B.slice(0, Z + 1);

  let J = [...A];
  return J[A.length - 1] = {
    ...Q,
    message: { ...Q.message, content: Y }
  }, J
}

// READABLE (for understanding):
function removeTrailingThinkingBlocks(messages) {
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage || lastMessage.type !== "assistant") return messages;

  const contentBlocks = lastMessage.message.content;
  const lastBlock = contentBlocks[contentBlocks.length - 1];
  if (!lastBlock || !isThinkingBlock(lastBlock)) return messages;

  // Find the last non-thinking block index
  let lastNonThinkingIndex = contentBlocks.length - 1;
  while (lastNonThinkingIndex >= 0) {
    const block = contentBlocks[lastNonThinkingIndex];
    if (!block || !isThinkingBlock(block)) break;
    lastNonThinkingIndex--
  }

  // Log metrics
  telemetry("tengu_filtered_trailing_thinking_block", {
    messageUUID: lastMessage.uuid,
    blocksRemoved: contentBlocks.length - lastNonThinkingIndex - 1,
    remainingBlocks: lastNonThinkingIndex + 1
  });

  // Create filtered content (or placeholder if all thinking)
  const finalContent = lastNonThinkingIndex < 0
    ? [{type: "text", text: "[No message content]", citations: []}]
    : contentBlocks.slice(0, lastNonThinkingIndex + 1);

  const updatedMessages = [...messages];
  updatedMessages[messages.length - 1] = {
    ...lastMessage,
    message: { ...lastMessage.message, content: finalContent }
  };
  return updatedMessages;
}

// Mapping: w$7→removeTrailingThinkingBlocks, _J9→isThinkingBlock
```

### 11.3 Orphaned Thinking Message Removal (Restore)

```javascript
// ============================================
// filterOrphanedThinkingMessages (Su2) - Clean up orphaned thinking-only messages
// Location: chunks.148.mjs:591-611
// ============================================

// ORIGINAL (for source lookup):
function Su2(A) {
  // First pass: collect IDs of messages with mixed thinking+non-thinking content
  let Q = new Set;
  for (let G of A) {
    if (G.type !== "assistant") continue;
    let Z = G.message.content;
    if (!Array.isArray(Z)) continue;
    if (Z.some((J) => J.type !== "thinking" && J.type !== "redacted_thinking") && G.message.id)
      Q.add(G.message.id)
  }

  // Second pass: filter out orphaned thinking-only messages
  return A.filter((G) => {
    if (G.type !== "assistant") return !0;
    let Z = G.message.content;
    if (!Array.isArray(Z) || Z.length === 0) return !0;
    if (!Z.every((J) => J.type === "thinking" || J.type === "redacted_thinking")) return !0;
    if (G.message.id && Q.has(G.message.id)) return !0;

    // Log and filter out
    return l("tengu_filtered_orphaned_thinking_message", {
      messageUUID: G.uuid,
      messageId: G.message.id,
      blockCount: Z.length
    }), !1
  })
}

// READABLE (for understanding):
function filterOrphanedThinkingMessages(messages) {
  // First pass: collect IDs of messages with mixed content (thinking + non-thinking)
  const messagesWithMixedContent = new Set();
  for (const message of messages) {
    if (message.type !== "assistant") continue;
    const content = message.message.content;
    if (!Array.isArray(content)) continue;

    // Has at least one non-thinking block AND has an ID
    if (content.some((block) =>
        block.type !== "thinking" && block.type !== "redacted_thinking"
      ) && message.message.id) {
      messagesWithMixedContent.add(message.message.id);
    }
  }

  // Second pass: filter out orphaned thinking-only messages
  return messages.filter((message) => {
    // Keep all non-assistant messages
    if (message.type !== "assistant") return true;

    const content = message.message.content;
    if (!Array.isArray(content) || content.length === 0) return true;

    // Keep if has non-thinking content
    if (!content.every((block) =>
        block.type === "thinking" || block.type === "redacted_thinking"
      )) return true;

    // Keep if part of a mixed-content message
    if (message.message.id && messagesWithMixedContent.has(message.message.id)) return true;

    // Log and remove orphaned thinking-only message
    telemetry("tengu_filtered_orphaned_thinking_message", {
      messageUUID: message.uuid,
      messageId: message.message.id,
      blockCount: content.length
    });
    return false;
  })
}

// Mapping: Su2→filterOrphanedThinkingMessages
```

### 11.4 Session Restore with Thinking Cleanup

```javascript
// ============================================
// restoreSessionMessages (dbA) - Session restore pipeline
// Location: chunks.120.mjs:2594-2605
// ============================================

// ORIGINAL (for source lookup):
function dbA(A) {
  try {
    let Q = A.map(tl5),
      B = Pu2(Q),          // Filter tool blocks
      G = Su2(B);          // ← FILTER ORPHANED THINKING MESSAGES
    if (G[G.length - 1]?.type === "user") G.push(QU({ content: v9A }));
    return G
  } catch (Q) {
    throw e(Q), Q
  }
}

// READABLE (for understanding):
function restoreSessionMessages(messages) {
  try {
    // Step 1: Convert to internal format
    const convertedMessages = messages.map(convertToInternalFormat);

    // Step 2: Filter tool blocks without results
    const toolBlocksFiltered = filterToolBlocks(convertedMessages);

    // Step 3: Remove orphaned thinking-only messages
    const thinkingFiltered = filterOrphanedThinkingMessages(toolBlocksFiltered);

    // Step 4: Ensure ends with assistant message
    if (thinkingFiltered[thinkingFiltered.length - 1]?.type === "user") {
      thinkingFiltered.push(createAssistantMessage({ content: DEFAULT_CONTENT }));
    }

    return thinkingFiltered;
  } catch (error) {
    throw logError(error), error;
  }
}

// Mapping: dbA→restoreSessionMessages, Su2→filterOrphanedThinkingMessages, Pu2→filterToolBlocks
```

### 11.5 Thinking Blocks in Tool Filtering (UG7 - PRESERVATION)

**Important:** The `UG7` function (filterCompactableMessages) explicitly **PRESERVES** thinking blocks while filtering orphaned tool blocks:

```javascript
// Location: chunks.135.mjs:694-712
// Filter predicate: EXCLUDE thinking from removal, only filter tool blocks
const shouldKeepBlock = (block) =>
  block.type !== "thinking" &&           // ← Will NOT be removed
  block.type !== "redacted_thinking" &&  // ← Will NOT be removed
  !(block.type === "tool_use" && !validToolIds.has(block.id)) &&
  !(block.type === "tool_result" && !validToolIds.has(block.tool_use_id));
```

The double negation means: thinking blocks are **ALWAYS KEPT** during tool block filtering.

### 11.6 Turn Counting - Skip Thinking-Only Messages

```javascript
// ============================================
// countTurnsForTodoReminder (s27) - Skips thinking-only messages
// Location: chunks.132.mjs:96-115
// ============================================

// ORIGINAL (for source lookup):
function s27(A) {
  let Q = -1, B = -1, G = 0, Z = 0;
  for (let Y = A.length - 1; Y >= 0; Y--) {
    let J = A[Y];
    if (J?.type === "assistant") {
      if (dF1(J)) continue;  // ← SKIP thinking-only messages
      // ... counting logic
    }
  }
  return { turnsSinceLastTodoWrite: G, turnsSinceLastReminder: Z }
}

// READABLE (for understanding):
function countTurnsForTodoReminder(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg?.type === "assistant") {
      // Skip thinking-only messages - don't count as turns
      if (isThinkingOnlyMessage(msg)) continue;
      // ... count actual turns
    }
  }
  return { turnsSinceLastTodoWrite, turnsSinceLastReminder };
}

// Mapping: dF1→isThinkingOnlyMessage
```

### 11.7 Compact/Restore Thinking Strategy Summary

| Operation | Function | Location | Behavior |
|-----------|----------|----------|----------|
| **Compact - Trailing** | `w$7` | chunks.148.mjs:559-589 | REMOVE trailing thinking blocks |
| **Restore - Orphaned** | `Su2` | chunks.148.mjs:591-611 | REMOVE orphaned thinking-only messages |
| **Tool Block Filter** | `UG7` | chunks.135.mjs:694-712 | **PRESERVE** thinking blocks |
| **Turn Counting** | `s27` | chunks.132.mjs:96-115 | SKIP thinking-only in turn count |
| **Session Restore** | `dbA` | chunks.120.mjs:2594-2605 | Clean up via `Su2` |

**Key insight:** Thinking blocks are intelligently handled:
- ✓ **PRESERVED** during tool block filtering (never removed with tool cleanup)
- ✓ **REMOVED** when orphaned (thinking-only messages with no mixed content)
- ✓ **REMOVED** when trailing at message end during compact
- ✓ **SKIPPED** in turn counting (don't contribute to turn limits)

---

## 12. Environment Variables

| Variable | Purpose | Priority |
|----------|---------|----------|
| `MAX_THINKING_TOKENS` | Override thinking budget (0 disables, >0 enables) | Highest |
| `DISABLE_INTERLEAVED_THINKING` | Disable interleaved thinking support | - |

---

## 13. Telemetry Events

| Event | Location | Trigger |
|-------|----------|---------|
| `tengu_thinking` | chunks.68.mjs:3469, 3491, 3501 | Thinking budget applied |
| `tengu_thinking_toggled` | chunks.137.mjs:706-708 | User toggles thinking in config |
| `tengu_filtered_trailing_thinking_block` | chunks.148.mjs:575 | Trailing thinking blocks removed during compact |
| `tengu_filtered_orphaned_thinking_message` | chunks.148.mjs:608 | Orphaned thinking-only message removed during restore |

---

## 14. Related Symbols Summary

### Core Activation Functions
- `q91` - isThinkingEnabled (chunks.68.mjs:3540-3547)
- `Hm` - calculateMaxThinkingTokens (chunks.68.mjs:3466-3476)
- `wz8` - isModelThinkingCapable (chunks.68.mjs:3533-3538)
- `o5A` - getModelMaxThinkingTokens (chunks.1.mjs:2240-2252)

### Keyword Detection
- `CjA` - detectThinkingKeyword (chunks.68.mjs:3513-3518)
- `qz8` - extractThinkingFromMessage (chunks.68.mjs:3482-3506)
- `Uz8` - thinkingLevelToTokens (chunks.68.mjs:3478-3480)
- `Nz8` - getMessageTextContent (chunks.68.mjs:3508-3511)
- `zDA` - extractKeywordPositions (chunks.68.mjs:3521-3531)

### Content Detection
- `leB` - containsThinkingContent (chunks.85.mjs:640-646)
- `_J9` - isThinkingBlock (chunks.148.mjs:555-557)
- `dF1` - isThinkingOnlyMessage (chunks.148.mjs:511-515)

### Compact/Restore Functions
- `UG7` - filterCompactableMessages (chunks.135.mjs:694-712)
- `w$7` - removeTrailingThinkingBlocks (chunks.148.mjs:559-589)
- `Su2` - filterOrphanedThinkingMessages (chunks.148.mjs:591-611)
- `dbA` - restoreSessionMessages (chunks.120.mjs:2594-2605)

### Context Building (Main Loop & Subagent)
- `vH1` - processUserInputWithThinking (chunks.134.mjs:2620-2642)
- `r77` - buildUserInputMessage (chunks.134.mjs:2582-2606)
- `aN` - mainQueryLoop (chunks.134.mjs:99-114)
- `oHA` - apiStreamHandler (chunks.134.mjs:202-206)
- `WJ` - buildToolUseContextForSubagent (chunks.154.mjs:1054-1073)
- `lkA` - buildToolUseContext (chunks.134.mjs:1918-1962)

### Constants
- `sB0` - THINKING_TOKEN_LEVELS (chunks.68.mjs:3573-3576)
- `sB0.ULTRATHINK` - 31999 tokens
- `sB0.NONE` - 0 tokens
- `Cz8` - ULTRATHINK_REGEX (chunks.68.mjs:3576)
- `jZ0` - DEFAULT_THINKING_BUDGET (chunks.85.mjs:856)
- `$b0` - INTERLEAVED_THINKING_BETA (chunks.1.mjs:2207)

> Full symbol index: See symbol_index_core_*.md and symbol_index_infra_*.md in 00_overview/
