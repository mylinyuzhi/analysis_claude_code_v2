# MCP Auto-Search Mode (2.1.7)

> **Default in 2.1.7** - MCP tool search is now "auto" mode by default
> **Threshold**: 10% of context window triggers auto-search mode
> **NEW in 2.1.0** - `list_changed` notification handling

---

## Overview

When MCP tool descriptions exceed 10% of the model's context window, the system:
1. Defers tool descriptions from initial prompt
2. Enables `MCPSearch` tool for dynamic tool discovery
3. Loads tool schemas only when needed

This reduces context usage while maintaining full MCP tool access.

---

## Architecture

```
┌───────────────────────────────────────────────────────────────────────┐
│                    MCP Auto-Search Decision Flow                       │
│                                                                        │
│  ┌─────────────────┐      ┌─────────────────────────────────────────┐ │
│  │ Calculate MCP   │      │ Threshold = 10% × Context Window        │ │
│  │ Description     │─────>│ (heB = 0.1, At8 = 2.5 char multiplier)  │ │
│  │ Character Count │      └─────────────────────────────────────────┘ │
│  └─────────────────┘                      │                           │
│                                           v                           │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                  Description Chars >= Threshold?                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│           │                                        │                  │
│        YES (Enable MCPSearch)              NO (Standard mode)         │
│           │                                        │                  │
│           v                                        v                  │
│  ┌─────────────────────┐                ┌─────────────────────┐      │
│  │ MCPSearch Tool      │                │ Load all MCP tool   │      │
│  │ enabled, tool       │                │ descriptions in     │      │
│  │ descriptions        │                │ system prompt       │      │
│  │ deferred            │                └─────────────────────┘      │
│  └─────────────────────┘                                             │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Auto-Search Decision Logic

```javascript
// ============================================
// shouldEnableToolSearch - Decides if MCPSearch mode should be enabled
// Location: chunks.85.mjs:559-592
// ============================================

// ORIGINAL (for source lookup):
async function RZ0(A, Q, B, G) {
  let Z = Q.filter((X) => X.isMcp).length;

  function Y(X, I, D, W) {
    l("tengu_tool_search_mode_decision", {
      enabled: X,
      mode: I,
      reason: D,
      checkedModel: A,
      mcpToolCount: Z,
      userType: "external",
      ...W
    })
  }
  if (!ueB(A)) return k(`Tool search disabled for model '${A}': model does not support tool_reference blocks.`), Y(!1, "standard", "model_unsupported"), !1;
  if (!meB(Q)) return k("Tool search disabled: MCPSearchTool is not available."), Y(!1, "standard", "mcp_search_unavailable"), !1;
  let J = k9A();
  switch (J) {
    case "tst":
      return Y(!0, J, "tst_enabled"), !0;
    case "tst-auto": {
      let X = await Zt8(Q, B, G),
        I = geB(A),
        D = X >= I;
      return k(`Auto tool search ${D?"enabled":"disabled"}: ${X} chars (threshold: ${I}, ${Math.round(heB*100)}% of context)`), Y(D, J, D ? "auto_above_threshold" : "auto_below_threshold", {
        mcpToolDescriptionChars: X,
        threshold: I
      }), D
    }
    case "mcp-cli":
    case "standard":
      return Y(!1, J, "standard_mode"), !1
  }
}

// READABLE (for understanding):
async function shouldEnableToolSearch(modelId, allTools, getPermissionContext, agents) {
  let mcpToolCount = allTools.filter((tool) => tool.isMcp).length;

  // Telemetry logging function
  function logDecision(enabled, mode, reason, extraData) {
    trackEvent("tengu_tool_search_mode_decision", {
      enabled,
      mode,
      reason,
      checkedModel: modelId,
      mcpToolCount,
      userType: "external",
      ...extraData
    });
  }

  // Check 1: Model support (Sonnet 4+, Opus 4+ required)
  if (!isModelSupportedForToolSearch(modelId)) {
    logDebug(`Tool search disabled for model '${modelId}': no tool_reference support.`);
    logDecision(false, "standard", "model_unsupported");
    return false;
  }

  // Check 2: MCPSearch tool must be available
  if (!isMcpSearchToolAvailable(allTools)) {
    logDebug("Tool search disabled: MCPSearchTool is not available.");
    logDecision(false, "standard", "mcp_search_unavailable");
    return false;
  }

  // Determine mode from environment/config
  let searchMode = getToolSearchMode();
  switch (searchMode) {
    case "tst":  // Forced enabled
      return logDecision(true, searchMode, "tst_enabled"), true;

    case "tst-auto": {  // Auto mode (default)
      // Calculate total MCP tool description size
      let descriptionChars = await calculateMcpDescriptionSize(allTools, getPermissionContext, agents);
      // Calculate threshold: 10% of context window × 2.5 char multiplier
      let threshold = calculateContextThreshold(modelId);
      let shouldEnable = descriptionChars >= threshold;

      logDebug(`Auto tool search ${shouldEnable?"enabled":"disabled"}: ${descriptionChars} chars (threshold: ${threshold}, 10% of context)`);
      logDecision(shouldEnable, searchMode,
        shouldEnable ? "auto_above_threshold" : "auto_below_threshold",
        { mcpToolDescriptionChars: descriptionChars, threshold }
      );
      return shouldEnable;
    }

    case "mcp-cli":
    case "standard":
      return logDecision(false, searchMode, "standard_mode"), false;
  }
}

// Mapping: RZ0→shouldEnableToolSearch, A→modelId, Q→allTools, B→getPermissionContext, G→agents
// ueB→isModelSupportedForToolSearch, meB→isMcpSearchToolAvailable, k9A→getToolSearchMode
// Zt8→calculateMcpDescriptionSize, geB→calculateContextThreshold
```

**Why 10% threshold:**
- Prevents MCP tool descriptions from dominating context
- Leaves 90%+ of context for user conversations and tool results
- Balances tool discoverability vs. context efficiency

---

## Threshold Calculation

```javascript
// ============================================
// Constants and threshold calculation
// Location: chunks.85.mjs:623-625, 491-494
// ============================================

// ORIGINAL:
heB = 0.1           // 10% of context window
At8 = 2.5           // Character-to-token multiplier

function geB(A) {
  let Q = KA1(A),           // getContextWindowSize
    B = Jq(A, Q);           // calculateTokenBudget
  return Math.floor(B * heB * At8)
}

// READABLE:
MCP_SEARCH_CONTEXT_RATIO = 0.1;   // 10%
CHAR_TO_TOKEN_MULTIPLIER = 2.5;  // ~2.5 chars per token average

function calculateContextThreshold(modelId) {
  let contextWindowSize = getContextWindowSize(modelId);
  let tokenBudget = calculateTokenBudget(modelId, contextWindowSize);
  // Convert token threshold to character threshold
  return Math.floor(tokenBudget * MCP_SEARCH_CONTEXT_RATIO * CHAR_TO_TOKEN_MULTIPLIER);
}

// Mapping: heB→MCP_SEARCH_CONTEXT_RATIO, At8→CHAR_TO_TOKEN_MULTIPLIER
// geB→calculateContextThreshold, KA1→getContextWindowSize, Jq→calculateTokenBudget
```

**Example calculation:**
- Sonnet 4 with 200K context window
- Token budget: ~180K tokens
- Threshold: `180000 × 0.1 × 2.5 = 45000 characters`
- If MCP descriptions exceed 45K chars, auto-search enables

---

## MCPSearch Tool

```javascript
// ============================================
// MCPSearch tool name constant
// Location: chunks.85.mjs:487
// ============================================

// ORIGINAL:
Db = "MCPSearch"

// READABLE:
MCPSEARCH_TOOL_NAME = "MCPSearch"

// Mapping: Db→MCPSEARCH_TOOL_NAME
```

### Query Syntax

| Query Type | Syntax | Description |
|------------|--------|-------------|
| Select specific tool | `select:mcp__server__tool` | Loads specific tool by name |
| Keyword search | `slack` | Search tools by keyword |
| Combined | `select:mcp__filesystem__list_directory` | Direct tool selection |

### Usage Examples (from prompt)

```
Good example:
[Calls MCPSearch with query: "select:mcp__filesystem__list_directory"]
↓
[Tool reference block returned with full schema]
↓
[Can now call mcp__filesystem__list_directory with correct params]

Bad example:
[Directly calls mcp__filesystem__list_directory without MCPSearch]
↓
[Error: tool schema not loaded]
```

---

## list_changed Notification Handling (2.1.0)

```javascript
// ============================================
// handleToolsListChanged - Refresh tools when server notifies
// Location: chunks.138.mjs:2917-2927
// ============================================

// ORIGINAL (for source lookup):
if (K.capabilities?.tools?.listChanged) K.client.setNotificationHandler(jY0, async () => {
  i0(K.name, "Received tools/list_changed notification, refreshing tools"), l("tengu_mcp_list_changed", {
    type: "tools"
  });
  try {
    Ax.cache.delete(K);
    let E = await Ax(K);
    J(K, E)
  } catch (E) {
    NZ(K.name, `Failed to refresh tools after list_changed notification: ${E instanceof Error?E.message:String(E)}`)
  }
});

// READABLE (for understanding):
if (serverConnection.capabilities?.tools?.listChanged) {
  serverConnection.client.setNotificationHandler(TOOLS_LIST_CHANGED_NOTIFICATION, async () => {
    logDebug(serverConnection.name, "Received tools/list_changed notification, refreshing tools");
    trackEvent("tengu_mcp_list_changed", { type: "tools" });

    try {
      // Clear cached tool list
      fetchMcpTools.cache.delete(serverConnection);
      // Fetch fresh tool list
      let newTools = await fetchMcpTools(serverConnection);
      // Update state
      updateServerState(serverConnection, newTools);
    } catch (error) {
      logError(serverConnection.name, `Failed to refresh tools after list_changed notification: ${error.message}`);
    }
  });
}

// Mapping: K→serverConnection, jY0→TOOLS_LIST_CHANGED_NOTIFICATION
// Ax→fetchMcpTools, J→updateServerState, i0→logDebug, NZ→logError
```

**Why list_changed matters:**
- MCP servers can dynamically add/remove tools
- Claude Code now reacts to these changes in real-time
- Tool cache is invalidated and refreshed automatically

### Notification Types

| Notification | Handler | Effect |
|--------------|---------|--------|
| `notifications/tools/list_changed` | jY0 | Refresh tool list |
| `notifications/prompts/list_changed` | _Y0 | Refresh prompt list |
| `notifications/resources/list_changed` | NY0 | Refresh resource list |

---

## Search Mode Configuration

### Environment Variables

| Variable | Values | Effect |
|----------|--------|--------|
| `ENABLE_TOOL_SEARCH` | `auto` | Force auto mode |
| `ENABLE_TOOL_SEARCH` | `true` | Always enable MCPSearch |
| `ENABLE_TOOL_SEARCH` | `false` | Disable MCPSearch |
| `ENABLE_MCP_CLI` | `true` | Use legacy MCP CLI mode |

### Mode Selection Logic

```javascript
// ============================================
// getToolSearchMode - Determine search mode from config
// Location: chunks.85.mjs:506-515
// ============================================

// ORIGINAL:
function k9A() {
  if (process.env.ENABLE_TOOL_SEARCH === "auto") return "tst-auto";
  if (a1(process.env.ENABLE_TOOL_SEARCH)) return "tst";
  if (a1(process.env.ENABLE_EXPERIMENTAL_MCP_CLI)) return "mcp-cli";
  if (iX(process.env.ENABLE_TOOL_SEARCH)) return "standard";
  if (iX(process.env.ENABLE_EXPERIMENTAL_MCP_CLI)) return "standard";
  if (!gW()) try {
    if (ZZ("tengu_mcp_tool_search", !0) === !1) return "standard"
  } catch {}
  return "tst-auto"  // Default: auto mode
}

// READABLE:
function getToolSearchMode() {
  if (process.env.ENABLE_TOOL_SEARCH === "auto") return "tst-auto";
  if (parseBoolean(process.env.ENABLE_TOOL_SEARCH)) return "tst";
  if (parseBoolean(process.env.ENABLE_EXPERIMENTAL_MCP_CLI)) return "mcp-cli";
  if (parseBooleanFalse(process.env.ENABLE_TOOL_SEARCH)) return "standard";
  if (parseBooleanFalse(process.env.ENABLE_EXPERIMENTAL_MCP_CLI)) return "standard";

  // Check feature flag (non-internal users)
  if (!isInternalUser()) {
    try {
      if (getFeatureFlag("tengu_mcp_tool_search", true) === false) return "standard";
    } catch {}
  }

  return "tst-auto";  // Default: auto mode
}

// Mapping: k9A→getToolSearchMode, a1→parseBoolean, iX→parseBooleanFalse
// gW→isInternalUser, ZZ→getFeatureFlag
```

---

## Model Support

Not all models support MCPSearch. The following models support `tool_reference` blocks:

- Claude Sonnet 4+
- Claude Opus 4+
- Newer Claude models

Legacy models fall back to standard mode (all tools in prompt).

---

## Dynamic Tool Loading

```javascript
// ============================================
// findDiscoveredToolsInHistory - Track tools discovered via MCPSearch
// Location: chunks.85.mjs:607-620
// ============================================

// ORIGINAL:
function _Z0(A) {
  let Q = new Set;
  for (let B of A) {
    if (B.type !== "user") continue;
    let G = B.message?.content;
    if (!Array.isArray(G)) continue;
    for (let Z of G)
      if (Jt8(Z)) {
        for (let Y of Z.content)
          if (Yt8(Y)) Q.add(Y.tool_name)
      }
  }
  if (Q.size > 0) k(`Dynamic tool loading: found ${Q.size} discovered tools in message history`);
  return Q
}

// READABLE:
function findDiscoveredToolsInHistory(messages) {
  let discoveredTools = new Set();

  for (let message of messages) {
    if (message.type !== "user") continue;
    let content = message.message?.content;
    if (!Array.isArray(content)) continue;

    for (let block of content) {
      if (isToolResultBlock(block)) {
        for (let innerBlock of block.content) {
          if (isToolReferenceBlock(innerBlock)) {
            discoveredTools.add(innerBlock.tool_name);
          }
        }
      }
    }
  }

  if (discoveredTools.size > 0) {
    logDebug(`Dynamic tool loading: found ${discoveredTools.size} discovered tools in message history`);
  }
  return discoveredTools;
}

// Mapping: _Z0→findDiscoveredToolsInHistory, Jt8→isToolResultBlock, Yt8→isToolReferenceBlock
```

**Why track discovered tools:**
- Tools discovered via MCPSearch are remembered across turns
- Prevents needing to re-search for same tools
- Improves conversation efficiency

---

## Related Symbols

> Symbol mappings: [symbol_index_infra.md](../00_overview/symbol_index_infra.md)

Key functions in this document:
- `MCPSEARCH_TOOL_NAME` (Db) - Tool name constant "MCPSearch"
- `shouldEnableToolSearch` (RZ0) - Auto-search decision logic
- `calculateContextThreshold` (geB) - Threshold calculation
- `getToolSearchMode` (k9A) - Mode selection
- `findDiscoveredToolsInHistory` (_Z0) - Track discovered tools
- `MCP_SEARCH_CONTEXT_RATIO` (heB) - 10% threshold constant
- `CHAR_TO_TOKEN_MULTIPLIER` (At8) - 2.5 char/token ratio

---

## See Also

- [../06_mcp/](.) - MCP protocol overview
- [../00_overview/changelog_analysis.md](../00_overview/changelog_analysis.md) - Version changes

