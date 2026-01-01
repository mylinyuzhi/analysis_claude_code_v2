# Think Keyword Analysis - Claude Code v2.0.59

> Analysis of Claude Code's thinking mode system including keyword detection, tab toggle, API integration, and the separate effort level system.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules (Thinking Mode section)

---

## 1. Overview

Claude Code implements an **Extended Thinking** feature that enables the model to perform deeper reasoning before responding. The thinking system operates through three activation methods:

1. **Keyword Detection**: Type "ultrathink" in your message
2. **Tab Toggle**: Press Tab to toggle thinking on/off
3. **Auto-Enable**: Certain models (claude-sonnet-4-5) enable thinking by default

**Key Design Decision:** Thinking mode and effort level are completely separate systems:
- **Thinking**: API-level `thinking` parameter with `budget_tokens` (0-31999)
- **Effort Level**: System prompt instruction `reasoning_effort` (45-99)

---

## 2. Keyword Detection System

### 2.1 Core Detection Function

```javascript
// ============================================
// detectThinkingKeyword - Main regex detection for ultrathink keyword
// Location: chunks.70.mjs:2275-2281
// ============================================

// ORIGINAL (for source lookup):
function Ae(A) {
  let Q = /\bultrathink\b/i.test(A);
  return {
    tokens: Q ? zm1.ULTRATHINK : zm1.NONE,
    level: Q ? "high" : "none"
  }
}

// READABLE (for understanding):
function detectThinkingKeyword(inputText) {
  let hasUltrathink = /\bultrathink\b/i.test(inputText);
  return {
    tokens: hasUltrathink ? THINKING_TOKEN_LEVELS.ULTRATHINK : THINKING_TOKEN_LEVELS.NONE,
    level: hasUltrathink ? "high" : "none"
  }
}

// Mapping: Ae→detectThinkingKeyword, A→inputText, Q→hasUltrathink, zm1→THINKING_TOKEN_LEVELS
```

**How it works:**
1. Uses regex `/\bultrathink\b/i` (case-insensitive, word boundary)
2. Returns token budget: 31999 for "high", 0 for "none"
3. Returns level string for UI styling decisions

### 2.2 Exact Keyword Matching

```javascript
// ============================================
// isUltrathinkExact - Check for exact ultrathink keyword variants
// Location: chunks.70.mjs:2195-2198
// ============================================

// ORIGINAL (for source lookup):
function WrA(A) {
  let Q = A.toLowerCase();
  return Q === "ultrathink" || Q === "think ultra hard" || Q === "think ultrahard"
}

// READABLE (for understanding):
function isUltrathinkExact(word) {
  let lowerWord = word.toLowerCase();
  return lowerWord === "ultrathink" ||
         lowerWord === "think ultra hard" ||
         lowerWord === "think ultrahard"
}

// Mapping: WrA→isUltrathinkExact, A→word, Q→lowerWord
```

**Supported Keywords:**
| Keyword | Recognized |
|---------|------------|
| "ultrathink" | Yes |
| "ULTRATHINK" | Yes (case-insensitive) |
| "think ultra hard" | Yes |
| "think ultrahard" | Yes |
| "megathink" | No |
| "think hard" | No |

### 2.3 Keyword Position Extraction

```javascript
// ============================================
// extractKeywordPositions - Extract all keyword matches with positions for UI highlighting
// Location: chunks.70.mjs:2283-2293
// ============================================

// ORIGINAL (for source lookup):
function XrA(A) {
  let Q = [],
    B = A.matchAll(CU6);
  for (let G of B)
    if (G.index !== void 0) Q.push({
      word: G[0],
      start: G.index,
      end: G.index + G[0].length
    });
  return Q
}

// READABLE (for understanding):
function extractKeywordPositions(inputText) {
  let matches = [];
  let regexResults = inputText.matchAll(ULTRATHINK_REGEX_GLOBAL);  // /\bultrathink\b/gi
  for (let match of regexResults) {
    if (match.index !== undefined) {
      matches.push({
        word: match[0],
        start: match.index,
        end: match.index + match[0].length
      });
    }
  }
  return matches;
}

// Mapping: XrA→extractKeywordPositions, A→inputText, Q→matches, B→regexResults, G→match, CU6→ULTRATHINK_REGEX_GLOBAL
```

**Why this approach:** Provides exact character positions for UI highlighting with rainbow shimmer effect.

### 2.4 Token Calculation Constants

```javascript
// ============================================
// THINKING_TOKEN_LEVELS - Token budget constants
// Location: chunks.70.mjs:2330-2333
// ============================================

// ORIGINAL:
zm1 = {
  ULTRATHINK: 31999,
  NONE: 0
}, CU6 = /\bultrathink\b/gi

// READABLE:
THINKING_TOKEN_LEVELS = {
  ULTRATHINK: 31999,  // Maximum thinking budget
  NONE: 0             // No thinking
}
ULTRATHINK_REGEX_GLOBAL = /\bultrathink\b/gi  // Global extraction regex
```

**Key insight:** Only two thinking levels exist - off (0 tokens) or full (31,999 tokens). No intermediate levels.

---

## 3. Tab Toggle Feature

### 3.1 Tab Key Handler

```javascript
// ============================================
// Tab key toggle handler - Toggle thinking mode with Tab key
// Location: chunks.138.mjs:3113-3147
// ============================================

// ORIGINAL (for source lookup):
e = Ae(Z).level !== "none";
return f1((l, k) => {
  if (k.tab && !k.shift) {
    if (X.length === 0 && Y !== "bash" && !Y0(process.env.MAX_THINKING_TOKENS)) {
      if (e) return;  // Skip if ultrathink keyword detected
      let m = !q.thinkingEnabled;
      w((o) => ({
        ...o,
        thinkingEnabled: m
      })), D({
        key: `toggled-thinking-${m?"on":"off"}`,
        // ... notification UI
      }), GA("tengu_thinking_toggled", {
        enabled: m
      })
    } else p();  // Autocomplete action
    return
  }
  // ... other key handlers
})

// READABLE (for understanding):
hasKeywordThinking = detectThinkingKeyword(inputValue).level !== "none";
return useKeyHandler((char, keyInfo) => {
  if (keyInfo.tab && !keyInfo.shift) {
    if (autocompleteItems.length === 0 && mode !== "bash" && !hasEnvThinkingOverride) {
      if (hasKeywordThinking) return;  // Don't toggle if keyword already enables thinking

      let newThinkingEnabled = !appState.thinkingEnabled;
      setAppState((state) => ({
        ...state,
        thinkingEnabled: newThinkingEnabled
      }));

      showNotification({
        key: `toggled-thinking-${newThinkingEnabled ? "on" : "off"}`,
        jsx: newThinkingEnabled ? "Thinking on" : "Thinking off"
      });

      logTelemetry("tengu_thinking_toggled", { enabled: newThinkingEnabled });
    } else {
      triggerAutocomplete();
    }
    return;
  }
});

// Mapping: e→hasKeywordThinking, Z→inputValue, k.tab→keyInfo.tab, X→autocompleteItems,
//          Y→mode, q.thinkingEnabled→appState.thinkingEnabled, m→newThinkingEnabled
```

**Tab Toggle Conditions:**
1. Tab pressed without Shift
2. No autocomplete suggestions active
3. Not in bash mode
4. `MAX_THINKING_TOKENS` env var not set
5. Ultrathink keyword not already detected

### 3.2 User Tips

```javascript
// ============================================
// User tips for thinking features
// Location: chunks.144.mjs:349-357
// ============================================

// ORIGINAL:
{
  id: "tab-toggle-thinking",
  content: async () => "Hit tab to toggle thinking mode on and off",
  cooldownSessions: 10,
  isRelevant: async () => !0
}, {
  id: "ultrathink-keyword",
  content: async () => "Type 'ultrathink' in your message to enable thinking for just that turn",
  cooldownSessions: 10,
  isRelevant: async () => !0
}
```

---

## 4. UI Integration

### 4.1 Keyword Highlighting

```javascript
// ============================================
// UI highlighting for ultrathink keywords
// Location: chunks.142.mjs:1987-2006
// ============================================

// ORIGINAL (for source lookup):
if (eA.length > 0) {
  let k1 = Ae(jA);
  if (k1.level !== "none") {
    let O0 = JrA[k1.level],
      oQ = iMB[k1.level];
    for (let tB of eA) M1.push({
      start: tB.start,
      end: tB.end,
      style: WrA(tB.word) ? {
        type: "rainbow",
        useShimmer: !0
      } : {
        type: "shimmer",
        baseColor: O0,
        shimmerColor: oQ
      },
      priority: 10
    })
  }
}

// READABLE (for understanding):
if (keywordMatches.length > 0) {
  let thinkingResult = detectThinkingKeyword(displayText);
  if (thinkingResult.level !== "none") {
    let baseColor = THINKING_LEVEL_COLORS[thinkingResult.level];      // "claude"
    let shimmerColor = THINKING_SHIMMER_COLORS[thinkingResult.level]; // "claudeShimmer"

    for (let match of keywordMatches) {
      highlights.push({
        start: match.start,
        end: match.end,
        style: isUltrathinkExact(match.word) ? {
          type: "rainbow",      // Rainbow shimmer for exact "ultrathink"
          useShimmer: true
        } : {
          type: "shimmer",      // Regular shimmer for variations
          baseColor: baseColor,
          shimmerColor: shimmerColor
        },
        priority: 10
      });
    }
  }
}

// Mapping: eA→keywordMatches, jA→displayText, k1→thinkingResult, JrA→THINKING_LEVEL_COLORS,
//          iMB→THINKING_SHIMMER_COLORS, tB→match
```

**Styling Constants:**
```javascript
THINKING_LEVEL_COLORS = {
  none: "text",
  high: "claude"
}

THINKING_SHIMMER_COLORS = {
  none: "promptBorderShimmer",
  high: "claudeShimmer"
}
```

### 4.2 Notification on Keyword Detection

```javascript
// ============================================
// Show notification when thinking keyword detected
// Location: chunks.142.mjs:2012-2022
// ============================================

// ORIGINAL:
aJ.useEffect(() => {
  if (!eA.length) return;
  if (eA.length && !OA.thinkingEnabled) v1({
    key: "thinking-toggled-via-keyword",
    jsx: wZ.createElement($, {
      color: "suggestion"
    }, "Thinking on"),
    priority: "immediate",
    timeoutMs: 3000
  })
}, [v1, OA.thinkingEnabled, mA, eA.length]);

// READABLE:
useEffect(() => {
  if (!keywordMatches.length) return;
  if (keywordMatches.length && !appState.thinkingEnabled) {
    showNotification({
      key: "thinking-toggled-via-keyword",
      jsx: <Text color="suggestion">Thinking on</Text>,
      priority: "immediate",
      timeoutMs: 3000
    });
  }
}, [showNotification, appState.thinkingEnabled, submitCount, keywordMatches.length]);
```

---

## 5. Processing Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         User Input                                  │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  detectThinkingKeyword(input)                                       │
│  - Regex: /\bultrathink\b/i                                        │
│  - Returns: { tokens: 31999|0, level: "high"|"none" }              │
└─────────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
        ┌─────────────────┐       ┌─────────────────┐
        │ Keyword Found   │       │ No Keyword      │
        │ level: "high"   │       │ level: "none"   │
        └─────────────────┘       └─────────────────┘
                │                         │
                ▼                         ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│ extractKeywordPositions()│   │ Check Tab Toggle State   │
│ → UI Rainbow Highlighting│   │ appState.thinkingEnabled │
└──────────────────────────┘   └──────────────────────────┘
                │                         │
                └────────────┬────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  thinkingMetadata attached to message                               │
│  { level: "high"|"none", disabled: boolean }                        │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  API Call with thinking parameter                                   │
│  thinking: { budget_tokens: 31999, type: "enabled" }               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. LLM API Integration

### 6.1 Request Payload Construction

```javascript
// ============================================
// API request construction with thinking parameter
// Location: chunks.153.mjs:48-78
// ============================================

// ORIGINAL (for source lookup):
let o = B > 0 ? {
    budget_tokens: k,
    type: "enabled"
  } : void 0,
  IA = B > 0,
  FA = bCB({
    hasThinking: IA
  }),
  zA = l?.maxTokensOverride || I.maxOutputTokensOverride || Math.max(B + 1, UQ0(I.model));
return {
  model: ac(I.model),
  messages: mv3(K, NA),
  system: V,
  tools: [...W, ...I.extraToolSchemas ?? []],
  tool_choice: I.toolChoice,
  ...F ? { betas: J } : {},
  metadata: Rl(),
  max_tokens: zA,
  thinking: o,
  ...FA && F && J.includes(nbA) ? { context_management: FA } : {},
  ...m
}

// READABLE (for understanding):
let thinkingConfig = maxThinkingTokens > 0 ? {
    budget_tokens: cappedBudget,  // min(maxThinkingTokens, maxTokensOverride - 1)
    type: "enabled"
  } : undefined;

let hasThinking = maxThinkingTokens > 0;
let contextManagement = buildContextManagementEdits({ hasThinking });
let maxOutputTokens = overrides.maxTokens ||
                      options.maxOutputTokensOverride ||
                      Math.max(maxThinkingTokens + 1, getModelMaxOutputTokens(options.model));

return {
  model: normalizeModelName(options.model),
  messages: normalizeMessages(messages, enableCaching),
  system: systemPrompt,
  tools: [...toolSchemas, ...options.extraToolSchemas ?? []],
  tool_choice: options.toolChoice,
  ...(includeBetas ? { betas: betaHeaders } : {}),
  metadata: getRequestMetadata(),
  max_tokens: maxOutputTokens,
  thinking: thinkingConfig,
  ...(contextManagement && includeBetas && betaHeaders.includes(CONTEXT_MANAGEMENT_BETA)
      ? { context_management: contextManagement }
      : {}),
  ...modelParameters
};

// Mapping: o→thinkingConfig, B→maxThinkingTokens, k→cappedBudget, IA→hasThinking,
//          FA→contextManagement, zA→maxOutputTokens, K→messages, V→systemPrompt
```

**Token Budget Relationships:**
```
max_tokens >= budget_tokens + 1
budget_tokens = min(thinkingBudget, maxTokensOverride - 1)
```

### 6.2 Model-Specific max_output_tokens

```javascript
// ============================================
// getModelMaxOutputTokens - Get default max tokens by model
// Location: chunks.153.mjs:478-493
// ============================================

// ORIGINAL:
function UQ0(A) {
  let Q = A.toLowerCase(), B;
  if (Q.includes("3-5")) B = 8192;
  else if (Q.includes("claude-3-opus")) B = 4096;
  else if (Q.includes("claude-3-sonnet")) B = 8192;
  else if (Q.includes("claude-3-haiku")) B = 4096;
  else if (Q.includes("opus-4-5")) B = 64000;
  else if (Q.includes("opus-4")) B = 32000;
  else if (Q.includes("sonnet-4") || Q.includes("haiku-4")) B = 64000;
  else B = 32000;

  let G = HkA.validate(process.env.CLAUDE_CODE_MAX_OUTPUT_TOKENS);
  return Math.min(G.effective, B)
}

// READABLE:
function getModelMaxOutputTokens(model) {
  let modelLower = model.toLowerCase();
  let defaultTokens;

  if (modelLower.includes("3-5")) defaultTokens = 8192;
  else if (modelLower.includes("claude-3-opus")) defaultTokens = 4096;
  else if (modelLower.includes("claude-3-sonnet")) defaultTokens = 8192;
  else if (modelLower.includes("claude-3-haiku")) defaultTokens = 4096;
  else if (modelLower.includes("opus-4-5")) defaultTokens = 64000;
  else if (modelLower.includes("opus-4")) defaultTokens = 32000;
  else if (modelLower.includes("sonnet-4") || modelLower.includes("haiku-4")) defaultTokens = 64000;
  else defaultTokens = 32000;

  let envOverride = validateEnvTokens(process.env.CLAUDE_CODE_MAX_OUTPUT_TOKENS);
  return Math.min(envOverride.effective, defaultTokens);
}

// Mapping: UQ0→getModelMaxOutputTokens, A→model, Q→modelLower, B→defaultTokens
```

| Model | Default max_tokens |
|-------|-------------------|
| claude-3-5-* | 8,192 |
| claude-3-opus | 4,096 |
| claude-3-sonnet | 8,192 |
| claude-3-haiku | 4,096 |
| **opus-4-5** | **64,000** |
| opus-4 | 32,000 |
| sonnet-4/haiku-4 | 64,000 |
| Default | 32,000 |

---

## 7. Thinking Content Rendering

### 7.1 Thinking Indicator UI

```javascript
// ============================================
// ThinkingIndicator - Display thinking status during/after streaming
// Location: chunks.118.mjs:1074-1095
// ============================================

// ORIGINAL:
function DO2({ streamMode: A }) {
  let [Q, B] = CRA.useState(null), [G, Z] = CRA.useState(null);
  if (CRA.useEffect(() => {
      if (A === "thinking" && Q === null) B(Date.now());
      else if (A !== "thinking" && Q !== null) Z(Date.now() - Q), B(null)
    }, [A, Q]), A === "thinking")
    return MP.createElement(S, { marginTop: 1 },
      MP.createElement($, { dimColor: !0 }, "∴ Thinking…"));

  if (G !== null) return MP.createElement(S, { marginTop: 1 },
    MP.createElement($, { dimColor: !0 },
      "∴ Thought for ", Math.max(1, Math.round(G / 1000)), "s (",
      MP.createElement($, { dimColor: !0, bold: !0 }, "ctrl+o"),
      " to show thinking)"));
  return null
}

// READABLE:
function ThinkingIndicator({ streamMode }) {
  let [thinkingStartTime, setThinkingStartTime] = useState(null);
  let [thinkingDuration, setThinkingDuration] = useState(null);

  useEffect(() => {
    if (streamMode === "thinking" && thinkingStartTime === null) {
      setThinkingStartTime(Date.now());
    } else if (streamMode !== "thinking" && thinkingStartTime !== null) {
      setThinkingDuration(Date.now() - thinkingStartTime);
      setThinkingStartTime(null);
    }
  }, [streamMode, thinkingStartTime]);

  // During thinking
  if (streamMode === "thinking") {
    return <Box marginTop={1}>
      <Text dimColor>∴ Thinking…</Text>
    </Box>;
  }

  // After thinking completed
  if (thinkingDuration !== null) {
    return <Box marginTop={1}>
      <Text dimColor>
        ∴ Thought for {Math.max(1, Math.round(thinkingDuration / 1000))}s
        (<Text dimColor bold>ctrl+o</Text> to show thinking)
      </Text>
    </Box>;
  }

  return null;
}

// Mapping: DO2→ThinkingIndicator, A→streamMode, Q→thinkingStartTime, G→thinkingDuration
```

**Display States:**
| State | Display |
|-------|---------|
| During streaming | `∴ Thinking…` |
| After completion | `∴ Thought for Xs (ctrl+o to show thinking)` |
| Expanded | Full thinking content visible |

### 7.2 Content Block Types

```javascript
// Thinking block types handled
case "thinking":          // Standard thinking blocks (expandable)
case "redacted_thinking": // Filtered/summarized thinking
```

---

## 8. Thinking Preservation System

### 8.1 Context Management Configuration

```javascript
// ============================================
// buildContextManagementEdits - Configure thinking preservation
// Location: chunks.60.mjs:392-445
// ============================================

// ORIGINAL (key section):
if (B && Q) {
  let Y = {
    type: "clear_thinking_20251015",
    keep: "all"
  };
  I.push(Y)
}
return I.length > 0 ? { edits: I } : void 0

// READABLE:
function buildContextManagementEdits({ hasThinking = false }) {
  let preserveEnabled = checkFeatureFlag("preserve_thinking", "enabled", false);
  if (!preserveEnabled) return undefined;

  let edits = [];

  // When thinking is present AND feature enabled
  if (preserveEnabled && hasThinking) {
    edits.push({
      type: "clear_thinking_20251015",
      keep: "all"  // Full preservation, NOT truncated
    });
  }

  return edits.length > 0 ? { edits } : undefined;
}
```

**API Integration:**
- Beta header required: `"context-management-2025-06-27"`
- Condition: `preserve_thinking` experiment enabled + `hasThinking: true`
- Effect: Thinking preserved across conversation turns with `keep: "all"`

---

## 9. Thinking Levels Analysis

**Only Two Levels Exist:**

| Level | Token Budget | UI Theme | Triggers |
|-------|--------------|----------|----------|
| `none` | 0 | "text" / "promptBorderShimmer" | Default state |
| `high` | 31,999 | "claude" / "claudeShimmer" | "ultrathink" keyword |

**NOT Implemented:**
- megathink
- think hard / thinkhard
- Low / medium levels

**Key insight:** The thinking system is binary - either off (0 tokens) or full (31,999 tokens). There are no intermediate thinking levels.

### 9.1 ThinkingMetadata Construction (Key to Understanding "No Keyword" Case)

```javascript
// ============================================
// buildThinkingMetadata - Constructs thinking metadata for messages
// Location: chunks.142.mjs:3046-3060
// ============================================

// ORIGINAL (for source lookup):
function Qj3(A, Q, B, G) {
  if (A !== "prompt") return;
  let Z = Q > 0,
    I = Z ? XrA(B) : [],
    Y = !G && !Z;
  return {
    level: Y ? "none" : "high",
    disabled: Y,
    triggers: I.map((W) => ({
      start: W.start,
      end: W.end,
      text: B.slice(W.start, W.end)
    }))
  }
}

// READABLE (for understanding):
function buildThinkingMetadata(mode, keywordTokens, inputText, thinkingEnabled) {
  if (mode !== "prompt") return;

  let hasKeyword = keywordTokens > 0;
  let keywordPositions = hasKeyword ? extractKeywordPositions(inputText) : [];
  let disabled = !thinkingEnabled && !hasKeyword;

  return {
    level: disabled ? "none" : "high",   // ← ONLY two values possible!
    disabled: disabled,
    triggers: keywordPositions.map((match) => ({
      start: match.start,
      end: match.end,
      text: inputText.slice(match.start, match.end)
    }))
  }
}

// Mapping: Qj3→buildThinkingMetadata, A→mode, Q→keywordTokens, B→inputText, G→thinkingEnabled
```

**Critical Logic Analysis:**

| thinkingEnabled | hasKeyword | disabled | level | Resulting Budget |
|-----------------|------------|----------|-------|------------------|
| `false` | `false` | `true` | `"none"` | 0 tokens |
| `false` | `true` | `false` | `"high"` | 31,999 tokens |
| `true` | `false` | `false` | `"high"` | **31,999 tokens** ← Tab toggle without keyword |
| `true` | `true` | `false` | `"high"` | 31,999 tokens |

**Key insight:** When thinking is enabled via Tab toggle (`thinkingEnabled=true`) but no keyword is detected (`hasKeyword=false`), the level is still `"high"`, which converts to **31,999 tokens** via `levelToTokens()`.

### 9.2 levelToTokens Conversion

```javascript
// ============================================
// levelToTokens - Convert level string to token count
// Location: chunks.70.mjs:2240-2242
// ============================================

// ORIGINAL:
function EU6(A) {
  return A === "high" ? zm1.ULTRATHINK : 0
}

// READABLE:
function levelToTokens(level) {
  return level === "high" ? THINKING_TOKEN_LEVELS.ULTRATHINK : 0
  // Returns: 31999 if "high", 0 otherwise
}
```

**Conclusion:** Keyword ("ultrathink") and Tab toggle produce **identical token budgets** (31,999 tokens). The keyword does NOT provide extra thinking capacity.

---

## 10. Model-Based Auto-Enable

```javascript
// ============================================
// isExtendedThinkingEnabled - Check if thinking is available for model
// Location: chunks.70.mjs:2295-2303
// ============================================

// ORIGINAL:
function VrA() {
  if (process.env.MAX_THINKING_TOKENS) return parseInt(process.env.MAX_THINKING_TOKENS, 10) > 0;
  let Q = l0().alwaysThinkingEnabled;
  if (Q === !0 || Q === !1) return Q;
  let B = k3();
  if (B.includes("claude-sonnet-4-5")) return !0;
  if (B.includes("claude-opus-4-5")) return BZ("tengu_deep_ocean_current", "on_by_default", !1);
  return !1
}

// READABLE:
function isExtendedThinkingEnabled() {
  // Priority 1: Environment variable override
  if (process.env.MAX_THINKING_TOKENS) {
    return parseInt(process.env.MAX_THINKING_TOKENS, 10) > 0;
  }

  // Priority 2: User config setting
  let configSetting = getUserConfig().alwaysThinkingEnabled;
  if (configSetting === true || configSetting === false) {
    return configSetting;
  }

  // Priority 3: Model-based defaults
  let currentModel = getCurrentModel();
  if (currentModel.includes("claude-sonnet-4-5")) {
    return true;  // Auto-enable for Sonnet 4.5
  }
  if (currentModel.includes("claude-opus-4-5")) {
    return checkFeatureFlag("tengu_deep_ocean_current", "on_by_default", false);
  }

  return false;  // Default: disabled
}

// Mapping: VrA→isExtendedThinkingEnabled, l0()→getUserConfig(), k3()→getCurrentModel()
```

**Priority Order:**
1. `MAX_THINKING_TOKENS` env var > 0 → enabled
2. Config `alwaysThinkingEnabled` boolean → use config value
3. Model `claude-sonnet-4-5` → **auto-enable**
4. Model `claude-opus-4-5` → check `tengu_deep_ocean_current` feature flag
5. Default → **disabled**

---

## 11. State Management

### 11.1 Initial State

```javascript
// Location: chunks.158.mjs:398
thinkingEnabled: VrA(),  // Initialized from isExtendedThinkingEnabled()
```

### 11.2 State Persistence

```javascript
// ============================================
// State change detection and persistence
// Location: chunks.156.mjs:2166-2168
// ============================================

// ORIGINAL:
if (A.thinkingEnabled !== Q.thinkingEnabled) cB("userSettings", {
  alwaysThinkingEnabled: A.thinkingEnabled
});

// READABLE:
if (newState.thinkingEnabled !== previousState.thinkingEnabled) {
  saveUserSettings({ alwaysThinkingEnabled: newState.thinkingEnabled });
}
```

---

## 12. Stream Response Handling

### 12.1 Thinking Block Processing

```javascript
// ============================================
// Thinking content block handling during streaming
// Location: chunks.153.mjs:142-200
// ============================================

// ORIGINAL:
case "thinking":
  R[IA.index] = {
    ...IA.content_block,
    thinking: ""
  };
  break;

// ...

case "thinking_delta":
  if (FA.type !== "thinking") throw GA("tengu_streaming_error", {
    error_type: "content_block_type_mismatch_thinking_delta"
  }), Error("Content block is not a thinking block");
  FA.thinking += IA.delta.thinking;
  break;

case "signature_delta":
  if (FA.type !== "thinking") throw GA("tengu_streaming_error", {
    error_type: "content_block_type_mismatch_thinking_signature"
  }), Error("Content block is not a thinking block");
  FA.signature = IA.delta.signature;
  break;

// READABLE:
case "thinking":
  contentBlocks[event.index] = {
    ...event.content_block,
    thinking: ""  // Initialize empty thinking string
  };
  break;

case "thinking_delta":
  if (block.type !== "thinking") {
    throw logError("tengu_streaming_error", {
      error_type: "content_block_type_mismatch_thinking_delta"
    });
  }
  block.thinking += event.delta.thinking;  // Accumulate thinking text
  break;

case "signature_delta":
  if (block.type !== "thinking") {
    throw logError("tengu_streaming_error", {
      error_type: "content_block_type_mismatch_thinking_signature"
    });
  }
  block.signature = event.delta.signature;  // Set authentication signature
  break;
```

**Stream Event Types:**
| Event | Delta Type | Purpose |
|-------|-----------|---------|
| `content_block_start` | `thinking` | Initialize thinking block |
| `content_block_delta` | `thinking_delta` | Append thinking text |
| `content_block_delta` | `signature_delta` | Set signature |
| `message_delta` | - | Update usage, stop_reason |

---

## 13. Telemetry & Analytics

| Event | Properties | Trigger |
|-------|-----------|---------|
| `tengu_thinking` | `provider`, `tokenCount` | Thinking tokens allocated |
| `tengu_thinking_toggled` | `enabled` | Tab key toggle |
| `tengu_filtered_trailing_thinking_block` | `messageUUID`, `blocksRemoved` | Trailing thinking filtered |
| `tengu_streaming_error` | `error_type` | Thinking block type mismatch |
| `tengu_max_tokens_reached` | `max_tokens` | Output limit hit |
| `tengu_streaming_fallback_to_non_streaming` | `model`, `error`, `maxThinkingTokens` | Streaming failure |

---

## 14. Error Handling

### 14.1 Streaming Errors

| Error Type | Trigger | Action |
|-----------|---------|--------|
| `content_block_type_mismatch_thinking_delta` | Delta on non-thinking block | Throw + telemetry |
| `content_block_type_mismatch_thinking_signature` | Signature on non-thinking | Throw + telemetry |
| `tengu_max_tokens_reached` | `stop_reason: "max_tokens"` | Yield warning message |
| `tengu_context_window_exceeded` | `stop_reason: "model_context_window_exceeded"` | Yield warning message |

### 14.2 Fallback Logic

```javascript
// On streaming failure → non-streaming retry
GA("tengu_streaming_fallback_to_non_streaming", {
  model, error, attemptNumber, maxOutputTokens, maxThinkingTokens
});
// Non-streaming with token capping: pv3(request, cv3=21333)
```

---

## 15. Beta Headers

| Header | Constant | Purpose |
|--------|----------|---------|
| `interleaved-thinking-2025-05-14` | `vo0` | Interleaved thinking support |
| `context-management-2025-06-27` | `nbA` | Context/thinking preservation |
| `context-1m-2025-08-07` | - | 1M context for Sonnet 4.5 |

---

## 16. Effort Level System (SEPARATE from Thinking)

### Critical Finding

**Effort level and thinking are completely independent systems.**

### 16.1 Effort Level Parsing

```javascript
// ============================================
// getEffortLevel - Parse effort level from env/config
// Location: chunks.121.mjs:2208-2225
// ============================================

// ORIGINAL:
function g60() {
  let A = Xj2();
  if (A.effortLevel !== void 0) return A.effortLevel;

  let Q = process.env.CLAUDE_CODE_EFFORT_LEVEL;
  if (Q) {
    if (Q === "unset") return;
    let Z = parseInt(Q, 10);
    if (!isNaN(Z) && h60(Z)) return Z;
    if (["low", "medium", "high"].includes(Q)) return Q
  }

  let G = l0().effortLevel;
  if (G === "unset") return;
  if (G !== void 0) {
    if (typeof G === "number" && h60(Z)) return G;
    if (typeof G === "string" && ["low", "medium", "high"].includes(G)) return G
  }
  return
}

// READABLE:
function getEffortLevel() {
  // Priority 1: Runtime override
  let clientData = getClientData();
  if (clientData.effortLevel !== undefined) return clientData.effortLevel;

  // Priority 2: Environment variable
  let envValue = process.env.CLAUDE_CODE_EFFORT_LEVEL;
  if (envValue) {
    if (envValue === "unset") return undefined;
    let numeric = parseInt(envValue, 10);
    if (!isNaN(numeric) && isValidEffortLevel(numeric)) return numeric;  // 0-9
    if (["low", "medium", "high"].includes(envValue)) return envValue;
  }

  // Priority 3: Config file
  let configValue = getUserConfig().effortLevel;
  if (configValue === "unset") return undefined;
  if (configValue !== undefined) {
    if (typeof configValue === "number" && isValidEffortLevel(configValue)) return configValue;
    if (typeof configValue === "string" && ["low", "medium", "high"].includes(configValue)) return configValue;
  }

  return undefined;
}
```

### 16.2 Effort → reasoning_effort Mapping

```javascript
// Location: chunks.152.mjs:2655-2659
EFFORT_LEVEL_MAPPING = {
  low: 45,
  medium: 75,
  high: 99
}
```

| Effort Level | reasoning_effort Value |
|--------------|----------------------|
| "low" | 45 |
| "medium" | 75 |
| "high" | 99 |

### 16.3 How Effort Level Works

Effort level adds a `<reasoning_effort>` section to the system prompt:

```xml
<reasoning_effort>75</reasoning_effort>

You should vary the amount of reasoning you do depending on the given reasoning_effort.
reasoning_effort varies between 0 and 100. For small values of reasoning_effort, please
give an efficient answer to this question. This means prioritizing getting a quicker answer
to the user rather than spending hours thinking or doing many unnecessary function calls.
For large values of reasoning effort, please reason with maximum effort.
```

### 16.4 Key Differences: Effort vs Thinking

| Aspect | Effort Level | Thinking |
|--------|--------------|----------|
| **Mechanism** | System prompt instruction | API `thinking` parameter |
| **Control** | `reasoning_effort` value (45-99) | `budget_tokens` (0-31999) |
| **Effect** | Behavioral guidance to model | Extended reasoning output |
| **Output** | No visible output | Thinking blocks in response |
| **Feature flag** | `tengu_effort_exp` | `tengu_deep_ocean_current` |
| **Environment var** | `CLAUDE_CODE_EFFORT_LEVEL` | `MAX_THINKING_TOKENS` |
| **Temperature** | Does NOT affect (always 1.0) | Does NOT affect (always 1.0) |

### 16.5 taskIntensityOverride is a No-Op

```javascript
// ============================================
// applyTaskIntensity - Does nothing (placeholder)
// Location: chunks.152.mjs:2716-2718
// ============================================

// ORIGINAL:
function hv3(A, Q, B) {
  return  // Empty implementation
}

// READABLE:
function applyTaskIntensity(taskIntensityOverride, modelParams, betas) {
  return;  // No-op - effort level is not used to modify API params
}
```

---

## 17. Configuration Reference

### Environment Variables

| Variable | Purpose | Values |
|----------|---------|--------|
| `MAX_THINKING_TOKENS` | Override thinking budget | Number > 0 |
| `CLAUDE_CODE_EFFORT_LEVEL` | Set effort level | "low", "medium", "high", 0-9, "unset" |
| `DISABLE_INTERLEAVED_THINKING` | Disable interleaved thinking | Boolean |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | Cap max output tokens | Number |

### Config Fields

| Field | Purpose | Values |
|-------|---------|--------|
| `alwaysThinkingEnabled` | Global thinking toggle | Boolean |
| `effortLevel` | Set effort level | "low", "medium", "high", 0-9, "unset" |

---

## 18. MAX_THINKING_TOKENS Deep Dive

**Critical Finding:** `MAX_THINKING_TOKENS` has a **dual role** - it both enables thinking AND sets the budget.

### 18.1 Dual Role Analysis

```javascript
// ============================================
// Role 1: Auto-enable thinking mode
// Location: chunks.70.mjs:2295-2296 (isExtendedThinkingEnabled)
// ============================================

// ORIGINAL:
function VrA() {
  if (process.env.MAX_THINKING_TOKENS) return parseInt(process.env.MAX_THINKING_TOKENS, 10) > 0;
  // ... other checks
}

// READABLE:
function isExtendedThinkingEnabled() {
  // If MAX_THINKING_TOKENS is set and > 0, thinking is AUTO-ENABLED
  if (process.env.MAX_THINKING_TOKENS) {
    return parseInt(process.env.MAX_THINKING_TOKENS, 10) > 0;
  }
  // ... check config, model defaults
}
```

```javascript
// ============================================
// Role 2: Set token budget (used every request)
// Location: chunks.70.mjs:2228-2236 (getMaxThinkingTokens)
// ============================================

// ORIGINAL:
function Xf(A, Q) {
  if (process.env.MAX_THINKING_TOKENS) {
    let B = parseInt(process.env.MAX_THINKING_TOKENS, 10);
    if (B > 0) GA("tengu_thinking", { provider: _R(), tokenCount: B });
    return B  // Returns env value directly, ignores other logic
  }
  return Math.max(...A.filter((B) => B.type === "user" && !B.isMeta).map(zU6), Q ?? 0)
}

// READABLE:
function getMaxThinkingTokens(messages, defaultValue) {
  // Priority 1: ENV override - used EVERY request when set
  if (process.env.MAX_THINKING_TOKENS) {
    let budget = parseInt(process.env.MAX_THINKING_TOKENS, 10);
    if (budget > 0) logTelemetry("tengu_thinking", { provider, tokenCount: budget });
    return budget;  // Always returns this value, no other checks
  }
  // Priority 2: Calculate from messages (keyword, thinkingMetadata)
  return Math.max(...messages.filter(isUserMessage).map(getMessageTokens), defaultValue ?? 0);
}
```

### 18.2 Call Chain Analysis

```javascript
// Location: chunks.145.mjs:211
maxThinkingTokens: q6 ?? (U.thinkingEnabled ? Xf(eB, void 0) : 0)
```

**Decision Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│ Is MAX_THINKING_TOKENS set?                                     │
└─────────────────────────────────────────────────────────────────┘
              │
    ┌─────────┴─────────┐
    ▼                   ▼
┌─────────┐       ┌─────────────────────────────────────────────┐
│ YES     │       │ NO                                          │
└─────────┘       └─────────────────────────────────────────────┘
    │                   │
    ▼                   ▼
┌─────────────────┐  ┌─────────────────────────────────────────────┐
│ thinkingEnabled │  │ Check other conditions:                     │
│ = true (auto)   │  │ - alwaysThinkingEnabled config              │
│                 │  │ - Model auto-enable (sonnet-4-5)            │
│ Budget = ENV    │  │ - Tab toggle state                          │
│ value (always)  │  │ - Keyword detection                         │
└─────────────────┘  └─────────────────────────────────────────────┘
```

### 18.3 Behavior Comparison

| Scenario | thinkingEnabled | Xf() called? | Budget |
|----------|-----------------|--------------|--------|
| `MAX_THINKING_TOKENS=10000` | `true` (auto) | Yes | **10000** (every request) |
| `MAX_THINKING_TOKENS=0` | `false` | No | **0** (disabled) |
| No env + Tab ON | `true` | Yes | 31999 (from keyword/metadata) |
| No env + Tab OFF | `false` | **No** | 0 |
| No env + "ultrathink" keyword | `true` | Yes | 31999 |

### 18.4 Key Differences: ENV vs Tab/Keyword

| Aspect | MAX_THINKING_TOKENS | Tab Toggle / Keyword |
|--------|---------------------|----------------------|
| **Activation** | Automatic (env set) | Manual (user action) |
| **Persistence** | Every request | Per-session / per-message |
| **Budget** | Custom (any value) | Fixed (31999) |
| **Override** | Highest priority | Lower priority |

### 18.5 Usage Examples

```bash
# Always use 10000 tokens thinking budget (auto-enabled)
MAX_THINKING_TOKENS=10000 claude

# Disable thinking completely (even if Tab toggle is on)
MAX_THINKING_TOKENS=0 claude

# Use maximum thinking budget
MAX_THINKING_TOKENS=31999 claude

# Use minimal thinking for faster responses
MAX_THINKING_TOKENS=1000 claude
```

**Key insight:** When `MAX_THINKING_TOKENS` is set:
1. Thinking is **automatically enabled** (no need for Tab or keyword)
2. The specified budget is used **every single request**
3. It **overrides** all other thinking configurations (keyword, Tab toggle, model defaults)

---

## 19. Key Files Reference

| File | Content | Lines |
|------|---------|-------|
| chunks.70.mjs | Core keyword detection, token constants | 2195-2335 |
| chunks.138.mjs | Tab toggle handler | 3113-3147 |
| chunks.142.mjs | UI highlighting | 1970-2022 |
| chunks.144.mjs | User tips | 349-357 |
| chunks.153.mjs | API integration, token calculations | 40-500 |
| chunks.156.mjs | State persistence | 2166-2168 |
| chunks.158.mjs | Initial state | 398 |
| chunks.118.mjs | Thinking indicator UI | 1074-1095 |
| chunks.60.mjs | Context management/preservation | 392-445 |
| chunks.154.mjs | Thinking block classification | 451-529 |
| chunks.19.mjs | Stream event handling | 1978-2080 |
| chunks.24.mjs | Beta headers | 1806-1885 |
| chunks.121.mjs | Effort level parsing | 2208-2225 |
| chunks.152.mjs | Reasoning effort prompt | 2286-2295, 2655-2718 |
