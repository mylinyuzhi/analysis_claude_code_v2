# /context Command - Token Calculation and UI Analysis

## Overview

The `/context` command visualizes current context usage as a colored grid. It calculates and displays token usage across multiple categories, providing users with insight into how their context window is being utilized.

**Location:** `chunks.148.mjs:656-694`
**Command Object:** `by3` (contextCommand)
**Type:** `local-jsx`

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      /context Command Flow                          │
└─────────────────────────────────────────────────────────────────────┘

  ┌──────────────────┐
  │ User: /context   │
  └────────┬─────────┘
           │
           ▼
  ┌────────────────────────────────────────────────────────────────┐
  │ by3.call()  (chunks.148.mjs:667-693)                          │
  │ ┌────────────────────────────────────────────────────────────┐ │
  │ │ 1. nk(messages) - Filter messages from last user message  │ │
  │ │ 2. Si(messages) - Microcompaction for tool results       │ │
  │ │ 3. xb2() - Main token counting function                  │ │
  │ │ 4. If non-interactive: fy3() → Markdown output           │ │
  │ │    If interactive: tV9 → React Grid component            │ │
  │ └────────────────────────────────────────────────────────────┘ │
  └────────────────────────────────────────────────────────────────┘
           │
           ▼
  ┌────────────────────────────────────────────────────────────────┐
  │ xb2() - Token Counter (chunks.125.mjs:198-349)                │
  │ ┌──────────────────────────────────────────────────────────┐   │
  │ │ Parallel Token Counting:                                  │   │
  │ │ Promise.all([                                             │   │
  │ │   ji5() → System prompt tokens                           │   │
  │ │   Si5() → Memory file tokens (CLAUDE.md)                 │   │
  │ │   _i5() → System tools tokens                            │   │
  │ │   XTA() → MCP tools tokens                               │   │
  │ │   xi5() → Custom agents tokens                           │   │
  │ │   yi5() → Slash command (Skill) tokens                   │   │
  │ │   vi5() → Message tokens                                 │   │
  │ │ ])                                                        │   │
  │ └──────────────────────────────────────────────────────────┘   │
  └────────────────────────────────────────────────────────────────┘
           │
           ▼
  ┌────────────────────────────────────────────────────────────────┐
  │ Output Rendering                                               │
  │ ┌────────────────────────────────────────────────────────────┐ │
  │ │ Interactive: tV9 (Grid UI with colored squares)           │ │
  │ │   - ⛁ = >70% full square                                  │ │
  │ │   - ⛀ = <70% full square                                  │ │
  │ │   - ⛶ = Free space (dimColor)                             │ │
  │ │   - ⛝ = Autocompact buffer                                │ │
  │ │                                                            │ │
  │ │ Non-interactive: fy3 (Markdown table output)              │ │
  │ └────────────────────────────────────────────────────────────┘ │
  └────────────────────────────────────────────────────────────────┘
```

---

## Command Definition

```javascript
// ============================================
// contextCommand - Visualize context usage grid
// Location: chunks.148.mjs:658-694
// ============================================

// ORIGINAL (for source lookup):
by3 = {
  name: "context",
  description: "Visualize current context usage as a colored grid",
  isEnabled: () => !0,
  isHidden: !1,
  type: "local-jsx",
  userFacingName() {
    return this.name
  },
  async call(A, {
    messages: Q,
    getAppState: B,
    options: {
      mainLoopModel: G,
      tools: Z,
      isNonInteractiveSession: I
    }
  }) {
    let Y = nk(Q),
      { messages: J } = await Si(Y),
      W = process.stdout.columns || 80,
      X = await B(),
      V = await xb2(J, G, async () => X.toolPermissionContext, Z, X.agentDefinitions, W);
    if (I) {
      let F = fy3(V);
      return A(F), null
    }
    return HSA.createElement($VA, {
      onComplete: A
    }, HSA.createElement(tV9, {
      data: V
    }))
  }
};

// READABLE (for understanding):
const contextCommand = {
  name: "context",
  description: "Visualize current context usage as a colored grid",
  isEnabled: () => true,
  isHidden: false,
  type: "local-jsx",
  userFacingName() {
    return this.name;
  },
  async call(onComplete, {
    messages,
    getAppState,
    options: { mainLoopModel, tools, isNonInteractiveSession }
  }) {
    // 1. Filter messages from last user message
    const filteredMessages = filterMessagesFromLastUser(messages);

    // 2. Apply microcompaction to clean up tool results
    const { messages: compactedMessages } = await microcompaction(filteredMessages);

    // 3. Get terminal width for grid sizing
    const terminalWidth = process.stdout.columns || 80;

    // 4. Get app state for context
    const appState = await getAppState();

    // 5. Calculate context usage (main token counting)
    const contextData = await calculateContextUsage(
      compactedMessages,
      mainLoopModel,
      async () => appState.toolPermissionContext,
      tools,
      appState.agentDefinitions,
      terminalWidth
    );

    // 6. Render output
    if (isNonInteractiveSession) {
      // Non-interactive: return markdown
      const markdown = formatContextMarkdown(contextData);
      return onComplete(markdown), null;
    }

    // Interactive: render React grid component
    return React.createElement(OutputWrapper, {
      onComplete
    }, React.createElement(ContextGrid, {
      data: contextData
    }));
  }
};

// Mapping: by3→contextCommand, A→onComplete, Q→messages, B→getAppState,
//          G→mainLoopModel, Z→tools, I→isNonInteractiveSession,
//          nk→filterMessagesFromLastUser, Si→microcompaction,
//          xb2→calculateContextUsage, fy3→formatContextMarkdown, tV9→ContextGrid
```

---

## Token Calculation Algorithm

### Main Function: xb2 (calculateContextUsage)

**What it does:** Calculates token usage across all categories and builds a grid visualization.

**How it works:**
1. Determines the effective model for context limit calculation
2. Gets max token limit (1M or 200K based on model)
3. Counts tokens from all 7 sources **in parallel** for performance
4. Calculates free space and autocompact buffer
5. Maps categories to colored grid squares

```javascript
// ============================================
// calculateContextUsage - Main context usage calculator
// Location: chunks.125.mjs:198-349
// ============================================

// ORIGINAL (for source lookup):
async function xb2(A, Q, B, G, Z, I) {
  let Y = Pt({
      permissionMode: (await B()).mode,
      mainLoopModel: Q
    }),
    J = su(Y),
    [W, { claudeMdTokens: X, memoryFileDetails: V }, F,
     { mcpToolTokens: K, mcpToolDetails: D },
     { agentTokens: H, agentDetails: C },
     { slashCommandTokens: E, commandInfo: U }, q] =
      await Promise.all([
        ji5(G, Y),
        Si5(),
        _i5(G, B, Z, Y),
        XTA(G, B, Z, Y),
        xi5(Z),
        yi5(G, B, Z),
        vi5(A)
      ]),
    R = q.totalTokens,
    T = b1A(),
    y = T ? TYA() - zQ0 : void 0;
  // ... build categories and grid
}

// READABLE (for understanding):
async function calculateContextUsage(messages, mainLoopModel, getToolPermissionContext, tools, agentDefinitions, terminalWidth) {
  // 1. Determine effective model for context limit
  const effectiveModel = getEffectiveModel({
    permissionMode: (await getToolPermissionContext()).mode,
    mainLoopModel
  });

  // 2. Get max token limit (1M for "[1m]" models, 200K otherwise)
  const maxTokens = getMaxTokensForModel(effectiveModel);

  // 3. Count tokens from all sources IN PARALLEL
  const [
    systemPromptTokens,
    { claudeMdTokens, memoryFileDetails },
    systemToolsTokens,
    { mcpToolTokens, mcpToolDetails },
    { agentTokens, agentDetails },
    { slashCommandTokens, commandInfo },
    messageBreakdown
  ] = await Promise.all([
    countSystemPromptTokens(tools, effectiveModel),
    countMemoryFileTokens(),
    countSystemToolsTokens(tools, getToolPermissionContext, agentDefinitions, effectiveModel),
    countMcpToolsTokens(tools, getToolPermissionContext, agentDefinitions, effectiveModel),
    countCustomAgentsTokens(agentDefinitions),
    countSlashCommandTokens(tools, getToolPermissionContext, agentDefinitions),
    countMessageTokens(messages)
  ]);

  // 4. Calculate totals and thresholds
  const messageTokens = messageBreakdown.totalTokens;
  const isAutoCompactEnabled = getAutoCompactEnabled();
  const autoCompactThreshold = isAutoCompactEnabled
    ? getAutoCompactThreshold() - AUTOCOMPACT_BUFFER
    : undefined;

  // 5. Build categories array
  const categories = [];
  if (systemPromptTokens > 0) {
    categories.push({ name: "System prompt", tokens: systemPromptTokens, color: "promptBorder" });
  }
  if (systemToolsTokens > 0) {
    categories.push({ name: "System tools", tokens: systemToolsTokens, color: "inactive" });
  }
  if (mcpToolTokens > 0) {
    categories.push({ name: "MCP tools", tokens: mcpToolTokens, color: "cyan_FOR_SUBAGENTS_ONLY" });
  }
  if (agentTokens > 0) {
    categories.push({ name: "Custom agents", tokens: agentTokens, color: "permission" });
  }
  if (claudeMdTokens > 0) {
    categories.push({ name: "Memory files", tokens: claudeMdTokens, color: "claude" });
  }
  if (messageTokens > 0) {
    categories.push({ name: "Messages", tokens: messageTokens, color: "purple_FOR_SUBAGENTS_ONLY" });
  }

  // 6. Add autocompact buffer if enabled
  if (isAutoCompactEnabled && autoCompactThreshold) {
    const bufferTokens = maxTokens - autoCompactThreshold;
    categories.push({ name: "Autocompact buffer", tokens: bufferTokens, color: "inactive" });
  }

  // 7. Calculate free space
  const usedTokens = categories.reduce((sum, cat) => sum + cat.tokens, 0);
  const freeTokens = Math.max(0, maxTokens - usedTokens);
  categories.push({ name: "Free space", tokens: freeTokens, color: "promptBorder" });

  // 8. Build visual grid
  const gridData = buildGridVisualization(categories, maxTokens, terminalWidth);

  return {
    categories,
    totalTokens: usedTokens,
    maxTokens,
    rawMaxTokens: maxTokens,
    percentage: Math.round(usedTokens / maxTokens * 100),
    gridRows: gridData.rows,
    model: effectiveModel,
    memoryFiles: memoryFileDetails,
    mcpTools: mcpToolDetails,
    agents: agentDetails,
    slashCommands: slashCommandTokens > 0 ? {
      totalCommands: commandInfo.totalCommands,
      includedCommands: commandInfo.includedCommands,
      tokens: slashCommandTokens
    } : undefined,
    autoCompactThreshold,
    isAutoCompactEnabled
  };
}

// Mapping: xb2→calculateContextUsage, A→messages, Q→mainLoopModel,
//          B→getToolPermissionContext, G→tools, Z→agentDefinitions, I→terminalWidth,
//          Y→effectiveModel, J→maxTokens, Pt→getEffectiveModel, su→getMaxTokensForModel
```

**Why this approach:**
- **Parallel counting:** Uses `Promise.all()` to count all 7 categories simultaneously, reducing latency
- **Progressive data structure:** Builds categories array incrementally, only including non-zero entries
- **Adaptive grid:** Grid size adjusts based on context window (1M vs 200K) and terminal width

---

## Context Window Detection

### Max Token Lookup: su (getMaxTokensForModel)

```javascript
// ============================================
// getMaxTokensForModel - Get max tokens based on model context window
// Location: chunks.1.mjs:2412-2415
// ============================================

// ORIGINAL (for source lookup):
function su(A) {
  if (A.includes("[1m]")) return 1e6;
  return 200000
}

// READABLE (for understanding):
function getMaxTokensForModel(modelName) {
  if (modelName.includes("[1m]")) return 1_000_000;  // 1M context window
  return 200_000;  // Standard 200K context window
}

// Mapping: su→getMaxTokensForModel, A→modelName
```

**Key insight:** The `[1m]` suffix in model names indicates 1M context window support. This is a simple string-based check rather than model configuration lookup.

| Model Name Contains | Max Tokens | Context Window |
|---------------------|------------|----------------|
| `[1m]` | 1,000,000 | 1M tokens |
| (default) | 200,000 | 200K tokens |

---

## Token Counting Methods

### Primary Method: API-Based Counting

```javascript
// ============================================
// countTokens - Primary token counting with fallback
// Location: chunks.125.mjs:44-48
// ============================================

// ORIGINAL:
async function WTA(A, Q) {
  let B = await bNA(A, Q);  // Try countTokens API first
  if (B !== null) return B;
  return await ReB(A, Q)    // Fallback to message creation
}

// READABLE:
async function countTokens(messages, tools) {
  let result = await tryCountTokensApi(messages, tools);
  if (result !== null) return result;
  return await countViaMessageCreation(messages, tools);
}

// Mapping: WTA→countTokens, bNA→tryCountTokensApi, ReB→countViaMessageCreation
```

### Method 1: CountTokens API (Primary)

```javascript
// ============================================
// tryCountTokensApi - Count tokens via Anthropic API
// Location: chunks.88.mjs:359-382
// ============================================

// ORIGINAL:
Y = await G.beta.messages.countTokens({
  model: ac(B),
  messages: A.length > 0 ? A : [{
    role: "user",
    content: "foo"
  }],
  tools: Q,
  ...Z.length > 0 ? { betas: Z } : {},
  ...I ? {
    thinking: {
      type: "enabled",
      budget_tokens: 1024
    },
    max_tokens: 2048
  } : {}
});
if (typeof Y.input_tokens !== "number") return null;
return Y.input_tokens

// READABLE:
const tokenCount = await client.beta.messages.countTokens({
  model: normalizeModel(modelName),
  messages: messages.length > 0 ? messages : [{ role: "user", content: "foo" }],
  tools: tools,
  ...betaFeatures.length > 0 ? { betas: betaFeatures } : {},
  ...hasThinking ? {
    thinking: { type: "enabled", budget_tokens: 1024 },
    max_tokens: 2048
  } : {}
});
if (typeof tokenCount.input_tokens !== "number") return null;
return tokenCount.input_tokens;
```

**Why this approach:** The dedicated `countTokens` API endpoint is the most accurate method, as it uses the exact same tokenization as the actual API call.

### Method 2: Message Creation Fallback

```javascript
// ============================================
// countViaMessageCreation - Fallback token counting
// Location: chunks.88.mjs:389-425
// ============================================

// ORIGINAL:
async function ReB(A, Q) {
  // ... setup
  let F = (await J.beta.messages.create({
    model: ac(Y),
    max_tokens: B ? 2048 : 1,  // Minimal tokens
    messages: W,
    tools: Q.length > 0 ? Q : void 0,
    // ...
  })).usage,
    K = F.input_tokens,
    D = F.cache_creation_input_tokens || 0,
    H = F.cache_read_input_tokens || 0;
  return K + D + H
}

// READABLE:
async function countViaMessageCreation(messages, tools) {
  // Create minimal message to get usage metrics
  const response = await client.beta.messages.create({
    model: selectedModel,
    max_tokens: hasThinking ? 2048 : 1,  // Minimal output
    messages: messagesForCount,
    tools: tools.length > 0 ? tools : undefined,
    // ...
  });

  const usage = response.usage;
  return usage.input_tokens +
         (usage.cache_creation_input_tokens || 0) +
         (usage.cache_read_input_tokens || 0);
}
```

**Trade-off:** This method is more expensive (creates an actual message) but works when the countTokens API is unavailable. Uses `max_tokens: 1` to minimize cost.

### Method 3: Quick Client-Side Estimation

```javascript
// ============================================
// estimateTokensFromLength - Quick heuristic estimation
// Location: chunks.88.mjs:385-387
// ============================================

// ORIGINAL:
function gG(A) {
  return Math.round(A.length / 4)
}

// READABLE:
function estimateTokensFromLength(text) {
  return Math.round(text.length / 4);  // ~1 token per 4 characters
}

// Mapping: gG→estimateTokensFromLength, A→text
```

**Key insight:** This heuristic (~4 characters per token) provides quick estimates for non-critical calculations. Not used in the main /context flow, but available for fast previews.

---

## Category Token Counting

### Helper Function Summary

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| `countSystemPromptTokens` | `ji5` | chunks.125.mjs:60-67 | System prompt tokens |
| `countMemoryFileTokens` | `Si5` | chunks.125.mjs:69-100 | Memory file tokens (CLAUDE.md) |
| `countSystemToolsTokens` | `_i5` | chunks.125.mjs:102-106 | System tools tokens (non-MCP) |
| `countMcpToolsTokens` | `XTA` | chunks.125.mjs:131-145 | MCP tools tokens |
| `countCustomAgentsTokens` | `xi5` | chunks.125.mjs:153-173 | Custom agents tokens |
| `countSlashCommandTokens` | `yi5` | chunks.125.mjs:112-129 | Slash command (Skill tool) tokens |
| `countMessageTokens` | `vi5` | chunks.125.mjs:175-196 | Message tokens |

### System Prompt Tokens (ji5)

```javascript
// ============================================
// countSystemPromptTokens - Count system prompt tokens
// Location: chunks.125.mjs:60-67
// ============================================

// ORIGINAL:
async function ji5(A, Q) {
  let [B, G] = await Promise.all([Tn(A, Q), iD()]),
      Z = [...B, ...Object.values(G)];
  if (Z.length < 1) return 0;
  return (await Promise.all(
    Z.filter(Y => Y.length > 0).map(Y => WTA([{ role: "user", content: Y }], []))
  )).reduce((Y, J) => Y + (J || 0), 0)
}

// READABLE:
async function countSystemPromptTokens(tools, model) {
  // Get system prompts and injections in parallel
  const [systemPrompts, injections] = await Promise.all([
    getSystemPrompts(tools, model),
    getInjections()
  ]);

  const allPrompts = [...systemPrompts, ...Object.values(injections)];
  if (allPrompts.length < 1) return 0;

  // Count tokens for each prompt in parallel
  const tokenCounts = await Promise.all(
    allPrompts
      .filter(prompt => prompt.length > 0)
      .map(prompt => countTokens([{ role: "user", content: prompt }], []))
  );

  return tokenCounts.reduce((sum, count) => sum + (count || 0), 0);
}

// Mapping: ji5→countSystemPromptTokens, A→tools, Q→model,
//          Tn→getSystemPrompts, iD→getInjections, WTA→countTokens
```

### Memory File Tokens (Si5)

```javascript
// ============================================
// countMemoryFileTokens - Count CLAUDE.md file tokens
// Location: chunks.125.mjs:69-100
// ============================================

// ORIGINAL:
async function Si5() {
  let A = gV(),
      Q = [],
      B = 0;
  if (A.length < 1) return { memoryFileDetails: [], claudeMdTokens: 0 };

  let G = await Promise.all(A.map(async (Z) => {
    let I = await WTA([{ role: "user", content: Z.content }], []);
    return { file: Z, tokens: I || 0 }
  }));

  for (let { file: Z, tokens: I } of G) {
    B += I;
    Q.push({ path: Z.path, type: Z.type, tokens: I });
  }
  return { claudeMdTokens: B, memoryFileDetails: Q }
}

// READABLE:
async function countMemoryFileTokens() {
  const memoryFiles = getMemoryFiles();  // Returns all CLAUDE.md files
  const details = [];
  let totalTokens = 0;

  if (memoryFiles.length < 1) {
    return { memoryFileDetails: [], claudeMdTokens: 0 };
  }

  // Count tokens for each file in parallel
  const results = await Promise.all(memoryFiles.map(async (file) => {
    const tokens = await countTokens([{ role: "user", content: file.content }], []);
    return { file, tokens: tokens || 0 };
  }));

  // Aggregate results
  for (const { file, tokens } of results) {
    totalTokens += tokens;
    details.push({ path: file.path, type: file.type, tokens });
  }

  return { claudeMdTokens: totalTokens, memoryFileDetails: details };
}

// Mapping: Si5→countMemoryFileTokens, gV→getMemoryFiles, WTA→countTokens
```

### Message Tokens (vi5)

```javascript
// ============================================
// countMessageTokens - Count conversation message tokens
// Location: chunks.125.mjs:175-196
// ============================================

// ORIGINAL:
async function vi5(A) {
  let Q = await Si(A),
      B = {
        totalTokens: 0,
        toolCallTokens: 0,
        toolResultTokens: 0,
        attachmentTokens: 0,
        assistantMessageTokens: 0,
        userMessageTokens: 0,
        toolCallsByType: new Map,
        toolResultsByType: new Map,
        attachmentsByType: new Map
      },
      G = await WTA(WZ(Q.messages).map((Z) => {
        if (Z.type === "assistant") return { role: "assistant", content: Z.message.content };
        return Z.message
      }), []);
  return B.totalTokens = G ?? 0, B
}

// READABLE:
async function countMessageTokens(messages) {
  // First apply microcompaction to clean up tool results
  const compacted = await microcompaction(messages);

  const breakdown = {
    totalTokens: 0,
    toolCallTokens: 0,
    toolResultTokens: 0,
    attachmentTokens: 0,
    assistantMessageTokens: 0,
    userMessageTokens: 0,
    toolCallsByType: new Map(),
    toolResultsByType: new Map(),
    attachmentsByType: new Map()
  };

  // Convert messages to API format and count
  const apiMessages = normalizeMessages(compacted.messages).map(msg => {
    if (msg.type === "assistant") {
      return { role: "assistant", content: msg.message.content };
    }
    return msg.message;
  });

  const tokenCount = await countTokens(apiMessages, []);
  breakdown.totalTokens = tokenCount ?? 0;

  return breakdown;
}

// Mapping: vi5→countMessageTokens, Si→microcompaction, WZ→normalizeMessages, WTA→countTokens
```

---

## UI Rendering

### Grid Component: tV9 (ContextGrid)

```javascript
// ============================================
// ContextGrid - Context visualization grid component
// Location: chunks.148.mjs:333-458
// ============================================

// ORIGINAL (abbreviated):
function tV9({ data: A }) {
  let {
    categories: Q, totalTokens: B, rawMaxTokens: G,
    percentage: Z, gridRows: I, model: Y,
    memoryFiles: J, mcpTools: W, agents: X, slashCommands: V
  } = A;

  let { columns: D } = WB();
  let H = D < 80;
  let C = Q.filter(U => U.tokens > 0 && U.name !== "Free space" && U.name !== cY1);

  return VQ.createElement(S, { flexDirection: "column", padding: H ? 0 : 1 },
    // Title
    VQ.createElement($, { bold: true }, "Context Usage"),

    // Grid + Stats row
    VQ.createElement(S, { flexDirection: "row", gap: 2 },
      // Grid squares
      VQ.createElement(S, { flexDirection: "column", flexShrink: 0 },
        I.map((row, idx) => VQ.createElement(S, { key: idx, flexDirection: "row", marginLeft: -1 },
          row.map((square, i) => {
            if (square.categoryName === "Free space")
              return VQ.createElement($, { key: i, dimColor: true }, "⛶ ");
            if (square.categoryName === cY1)
              return VQ.createElement($, { key: i, color: square.color }, "⛝ ");
            return VQ.createElement($, { key: i, color: square.color },
              square.squareFullness >= 0.7 ? "⛁ " : "⛀ "
            );
          })
        ))
      ),

      // Stats column
      VQ.createElement(S, { flexDirection: "column" },
        VQ.createElement($, { dimColor: true },
          Y, " · ", Math.round(B/1000), "k/", Math.round(G/1000), "k tokens (", Z, "%)"
        ),
        // Category breakdown with colors...
      )
    ),

    // Additional details: MCP tools, agents, memory files
    // ...
  );
}

// READABLE:
function ContextGrid({ data }) {
  const {
    categories, totalTokens, rawMaxTokens: maxTokens,
    percentage, gridRows, model,
    memoryFiles, mcpTools, agents, slashCommands
  } = data;

  const { columns } = useTerminalWidth();
  const isNarrowTerminal = columns < 80;
  const activeCategories = categories.filter(c =>
    c.tokens > 0 && c.name !== "Free space" && c.name !== "Autocompact buffer"
  );

  return (
    <Box flexDirection="column" padding={isNarrowTerminal ? 0 : 1}>
      <Text bold>Context Usage</Text>

      <Box flexDirection="row" gap={2}>
        {/* Grid visualization */}
        <Box flexDirection="column" flexShrink={0}>
          {gridRows.map((row, rowIdx) => (
            <Box key={rowIdx} flexDirection="row" marginLeft={-1}>
              {row.map((square, i) => {
                const icon = getSquareIcon(square);
                const color = square.color;
                return <Text key={i} color={color} dimColor={square.categoryName === "Free space"}>
                  {icon}{" "}
                </Text>;
              })}
            </Box>
          ))}
        </Box>

        {/* Stats */}
        <Box flexDirection="column">
          <Text dimColor>
            {model} · {Math.round(totalTokens/1000)}k/{Math.round(maxTokens/1000)}k tokens ({percentage}%)
          </Text>
          {activeCategories.map(cat => (
            <Box key={cat.name}>
              <Text color={cat.color}>⛁</Text>
              <Text> {cat.name}: </Text>
              <Text dimColor>
                {formatTokens(cat.tokens)} ({(cat.tokens/maxTokens*100).toFixed(1)}%)
              </Text>
            </Box>
          ))}
          {/* Free space entry */}
        </Box>
      </Box>

      {/* Detailed breakdowns */}
      {mcpTools.length > 0 && <McpToolsSection tools={mcpTools} />}
      {agents.length > 0 && <AgentsSection agents={agents} />}
      {memoryFiles.length > 0 && <MemoryFilesSection files={memoryFiles} />}
      {slashCommands && <SlashCommandsSection commands={slashCommands} />}
    </Box>
  );
}

// Mapping: tV9→ContextGrid, VQ→React, S→Box, $→Text, WB→useTerminalWidth
```

### Square Icons Reference

| Icon | Meaning | Condition |
|------|---------|-----------|
| `⛁` | Full square | `squareFullness >= 0.7` |
| `⛀` | Partial square | `squareFullness < 0.7` |
| `⛶` | Free space | Category = "Free space" |
| `⛝` | Autocompact buffer | Category = "Autocompact buffer" |

### Category Colors

| Category | Color Code | Meaning |
|----------|------------|---------|
| System prompt | `promptBorder` | Core instructions |
| System tools | `inactive` | Built-in tools |
| MCP tools | `cyan_FOR_SUBAGENTS_ONLY` | External MCP tools |
| Custom agents | `permission` | User-defined agents |
| Memory files | `claude` | CLAUDE.md content |
| Messages | `purple_FOR_SUBAGENTS_ONLY` | Conversation history |
| Free space | `promptBorder` (dimColor) | Available tokens |
| Autocompact buffer | `inactive` | Reserved for compaction |

---

## Markdown Output: fy3 (formatContextMarkdown)

```javascript
// ============================================
// formatContextMarkdown - Format context as Markdown table
// Location: chunks.148.mjs:529-644
// ============================================

// ORIGINAL (abbreviated):
function fy3(A) {
  let { categories: Q, totalTokens: B, rawMaxTokens: G, percentage: Z,
        model: I, memoryFiles: Y, mcpTools: J, agents: W, slashCommands: X } = A;

  let K = `## Context Usage\n\n`;
  K += `**Model:** ${I}  \n`;
  K += `**Tokens:** ${ng(B)} / ${ng(G)} (${Z}%)\n\n`;

  let D = Q.filter(H => H.tokens > 0 && H.name !== "Free space" && H.name !== "Autocompact buffer");
  if (D.length > 0) {
    K += `### Categories\n\n`;
    K += `| Category | Tokens | Percentage |\n`;
    K += `|----------|--------|------------|\n`;
    for (let E of D) {
      let U = (E.tokens / G * 100).toFixed(1);
      K += `| ${E.name} | ${ng(E.tokens)} | ${U}% |\n`;
    }
  }
  // ... additional sections
  return K;
}

// READABLE:
function formatContextMarkdown(data) {
  const { categories, totalTokens, rawMaxTokens, percentage, model,
          memoryFiles, mcpTools, agents, slashCommands } = data;

  let output = `## Context Usage\n\n`;
  output += `**Model:** ${model}  \n`;
  output += `**Tokens:** ${formatK(totalTokens)} / ${formatK(rawMaxTokens)} (${percentage}%)\n\n`;

  const activeCategories = categories.filter(c =>
    c.tokens > 0 && c.name !== "Free space" && c.name !== "Autocompact buffer"
  );

  if (activeCategories.length > 0) {
    output += `### Categories\n\n`;
    output += `| Category | Tokens | Percentage |\n`;
    output += `|----------|--------|------------|\n`;
    for (const cat of activeCategories) {
      const pct = (cat.tokens / rawMaxTokens * 100).toFixed(1);
      output += `| ${cat.name} | ${formatK(cat.tokens)} | ${pct}% |\n`;
    }
    // Add free space and autocompact buffer rows
  }

  // MCP tools table
  if (mcpTools.length > 0) {
    output += `### MCP Tools\n\n`;
    output += `| Tool | Server | Tokens |\n`;
    output += `|------|--------|--------|\n`;
    for (const tool of mcpTools) {
      output += `| ${tool.name} | ${tool.serverName} | ${formatK(tool.tokens)} |\n`;
    }
  }

  // Similar sections for agents, memory files, slash commands
  return output;
}

// Mapping: fy3→formatContextMarkdown, ng→formatK
```

### Token Formatting: ng (formatK)

```javascript
// ============================================
// formatK - Format tokens with K suffix
// Location: chunks.148.mjs:525-527
// ============================================

// ORIGINAL:
function ng(A) {
  return A < 1000 ? `${A}` : `${(A/1000).toFixed(1)}k`
}

// READABLE:
function formatK(tokens) {
  return tokens < 1000 ? `${tokens}` : `${(tokens/1000).toFixed(1)}k`;
}

// Examples:
// formatK(500) → "500"
// formatK(1500) → "1.5k"
// formatK(25000) → "25.0k"
```

---

## Grid Size Calculation

```javascript
// From xb2() - chunks.125.mjs:272-276

// ORIGINAL:
let e = I && I < 80,
    l = J >= 1e6 ? e ? 5 : 20 : e ? 5 : 10,
    k = J >= 1e6 ? 10 : e ? 5 : 10,
    m = l * k;

// READABLE:
const isNarrowTerminal = terminalWidth && terminalWidth < 80;
const gridCols = maxTokens >= 1_000_000
  ? (isNarrowTerminal ? 5 : 20)   // 1M context
  : (isNarrowTerminal ? 5 : 10);  // 200K context
const gridRows = maxTokens >= 1_000_000
  ? 10                             // 1M context: always 10 rows
  : (isNarrowTerminal ? 5 : 10);  // 200K context
const totalSquares = gridCols * gridRows;
```

### Grid Size Matrix

| Context Window | Terminal Width | Grid Size | Total Squares |
|----------------|----------------|-----------|---------------|
| 1M tokens | Wide (≥80) | 20×10 | 200 |
| 1M tokens | Narrow (<80) | 5×10 | 50 |
| 200K tokens | Wide (≥80) | 10×10 | 100 |
| 200K tokens | Narrow (<80) | 5×5 | 25 |

**Why this approach:**
- Larger grid for 1M context (more granularity needed)
- Narrower grid for small terminals to fit display
- Square aspect ratio for 200K (10×10) for visual balance

---

## Optimization Opportunities

### 1. Token Counting Parallelization

**Current:** Already uses `Promise.all()` for parallel counting.

**Potential Improvement:** Pre-cache token counts for stable content.

```javascript
const tokenCache = new Map();

async function cachedCountTokens(key, countFn) {
  if (tokenCache.has(key)) return tokenCache.get(key);
  const count = await countFn();
  tokenCache.set(key, count);
  return count;
}

// Usage: Cache system prompts, tool definitions (rarely change)
const systemPromptTokens = await cachedCountTokens(
  `system-${model}`,
  () => countSystemPromptTokens(tools, model)
);
```

### 2. Reduce API Calls

**Current:** Makes separate API calls for each category (7 calls).

**Potential Improvement:** Batch multiple content pieces into single API call.

```javascript
// Instead of 7 separate countTokens calls:
const allContent = [
  { key: "system", content: systemPrompt },
  { key: "tools", content: toolsJson },
  { key: "memory", content: memoryContent },
  // ...
];

// Single batch call
const tokenCounts = await batchCountTokens(allContent);
```

### 3. Progressive Loading

**Current:** Waits for all counts before rendering.

**Potential Improvement:** Show quick estimate first, then refine.

```javascript
// Phase 1: Show quick estimate immediately
const quickEstimate = messages.reduce((sum, m) =>
  sum + estimateTokensFromLength(JSON.stringify(m)), 0
);
renderQuickPreview(quickEstimate);

// Phase 2: Update with accurate counts
const accurateCounts = await calculateContextUsage(...);
renderFinalGrid(accurateCounts);
```

### 4. Memoize Grid Generation

**Current:** Creates new objects for each square on every render.

**Potential Improvement:** Use React memoization.

```javascript
const gridData = useMemo(() => {
  return buildGridVisualization(categories, maxTokens, terminalWidth);
}, [categories, maxTokens, terminalWidth]);
```

---

## Symbol Reference

| Obfuscated | Readable | Location | Type |
|------------|----------|----------|------|
| `by3` | contextCommand | chunks.148.mjs:658 | object |
| `xb2` | calculateContextUsage | chunks.125.mjs:198 | function |
| `tV9` | ContextGrid | chunks.148.mjs:333 | component |
| `fy3` | formatContextMarkdown | chunks.148.mjs:529 | function |
| `su` | getMaxTokensForModel | chunks.1.mjs:2412 | function |
| `WTA` | countTokens | chunks.125.mjs:44 | function |
| `ji5` | countSystemPromptTokens | chunks.125.mjs:60 | function |
| `Si5` | countMemoryFileTokens | chunks.125.mjs:69 | function |
| `_i5` | countSystemToolsTokens | chunks.125.mjs:102 | function |
| `XTA` | countMcpToolsTokens | chunks.125.mjs:131 | function |
| `xi5` | countCustomAgentsTokens | chunks.125.mjs:153 | function |
| `yi5` | countSlashCommandTokens | chunks.125.mjs:112 | function |
| `vi5` | countMessageTokens | chunks.125.mjs:175 | function |
| `gG` | estimateTokensFromLength | chunks.88.mjs:385 | function |
| `ng` | formatK | chunks.148.mjs:525 | function |
| `nk` | filterMessagesFromLastUser | chunks.154.mjs | function |
| `Si` | microcompaction | chunks.107.mjs | function |
| `Pt` | getEffectiveModel | chunks.59.mjs | function |
| `b1A` | getAutoCompactEnabled | - | function |
| `TYA` | getAutoCompactThreshold | - | function |
| `VQ` | React | chunks.148.mjs | module |
| `S` | Box | - | component |
| `$` | Text | - | component |
| `WB` | useTerminalWidth | - | hook |

---

## See Also

- [Built-in Commands](./builtin_commands.md) - All built-in slash commands
- [Command Execution](./execution.md) - How commands execute
- [Compact System](../08_compact/) - Auto-compaction and context management
