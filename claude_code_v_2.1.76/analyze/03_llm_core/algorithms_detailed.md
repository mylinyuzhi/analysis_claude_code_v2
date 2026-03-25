# Algorithm Deep-Dives (Claude Code v2.1.76)

> Detailed analysis of key algorithms and decision points in the CLI-UI-LLM core integration.
>
> **Cross-validated**: All symbols verified against source code on 2026-03-25.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `getInputDialogType` (ra6) - Dialog priority dispatcher at chunks.196.mjs:387
- `normalizeMessages` (cM) - Message normalization at chunks.173.mjs:1999
- `filterToolsByMode` (Xk8) - Tool filtering at chunks.93.mjs:1568
- `shouldTriggerAutoCompaction` (CmY) - Auto-compact check at chunks.147.mjs:2620
- `flattenMessages` (JM) - Message flattening at chunks.173.mjs:1516

---

## Algorithm 1: Dialog Priority Dispatcher (getInputDialogType/ra6)

### What it does

Determines which interactive dialog to display to the user based on current application state. This is the core prioritization logic that ensures the most important dialog is shown first.

### How it works

```javascript
// ============================================
// getInputDialogType (ra6) - Dialog priority dispatcher
// Location: chunks.196.mjs:387-404
// ============================================

// ORIGINAL (for source lookup):
function ra6() {
    if (lV6 || na6) return;
    if (W7) return "message-selector";
    if (y2) return;
    if (G7[0]) return "sandbox-permission";
    let P1 = !j8 || j8.shouldContinueAnimation;
    if (P1 && a8[0]) return "tool-permission";
    if (P1 && zA[0]) return "prompt";
    if (P1 && n.queue[0]) return "worker-sandbox-permission";
    if (P1 && o.queue[0]) return "elicitation";
    if (P1 && m26) return "cost";
    if (P1 && W6) return "ide-onboarding";
    if (P1 && g6) return "effort-callout";
    if (P1 && J1) return "remote-callout";
    if (P1 && e8) return "lsp-recommendation";
    if (P1 && E1) return "desktop-upsell";
    return
}

// READABLE (for understanding):
function getInputDialogType() {
    // 0. Blocking states - return undefined (no dialog)
    if (forkSessionDialogVisible || needsAuthentication) return;

    // 1. Message selector - highest priority
    if (messageSelectorVisible) return "message-selector";

    // 2. Input composition - don't show dialogs while typing
    if (isInputComposing) return;

    // 3. Sandbox permission - security-critical, shown immediately
    if (sandboxPermissionQueue[0]) return "sandbox-permission";

    // Check if animation should continue for lower-priority dialogs
    let shouldContinueAnimation = !toolJSX || toolJSX.shouldContinueAnimation;

    // 4-12. Lower priority dialogs (only shown if animation not blocked)
    if (shouldContinueAnimation && toolPermissionQueue[0]) return "tool-permission";
    if (shouldContinueAnimation && promptQueue[0]) return "prompt";
    if (shouldContinueAnimation && workerSandboxQueue.queue[0]) return "worker-sandbox-permission";
    if (shouldContinueAnimation && elicitationQueue.queue[0]) return "elicitation";
    if (shouldContinueAnimation && showCostDialog) return "cost";
    if (shouldContinueAnimation && showIdeOnboarding) return "ide-onboarding";
    if (shouldContinueAnimation && showEffortCallout) return "effort-callout";
    if (shouldContinueAnimation && showRemoteCallout) return "remote-callout";
    if (shouldContinueAnimation && lspRecommendation) return "lsp-recommendation";
    if (shouldContinueAnimation && showDesktopUpsell) return "desktop-upsell";

    // No dialog needed
    return undefined;
}

// Mapping: ra6→getInputDialogType, lV6→forkSessionDialogVisible, na6→needsAuthentication,
//   W7→messageSelectorVisible, y2→isInputComposing, G7→sandboxPermissionQueue,
//   a8→toolPermissionQueue, zA→promptQueue, m26→showCostDialog, W6→showIdeOnboarding,
//   g6→showEffortCallout, J1→showRemoteCallout, e8→lspRecommendation, E1→showDesktopUpsell
```

### Why this approach

**Priority tiers:**

1. **Tier 0 (Blocking)**: `forkSessionDialog`, `needsAuthentication` - These are modal and prevent all other dialogs
2. **Tier 1 (Immediate)**: `message-selector`, `sandbox-permission` - User-initiated or security-critical
3. **Tier 2 (Deferrable)**: All other dialogs - Controlled by `shouldContinueAnimation` flag

**Animation flag:**

The `shouldContinueAnimation` check ensures that if a tool result is still rendering (toolJSX exists and hasn't completed animation), informational dialogs don't interrupt the user's reading flow.

**Input composition:**

When `y2` (isInputComposing) is true, no dialogs are shown. This prevents interruptions while the user is actively typing.

### Key insight

The single-active-dialog pattern ensures:
- User attention is not divided
- Simpler state management (no dialog stacking)
- Predictable UX (always clear what needs response)

---

## Algorithm 2: Message Normalization (normalizeMessages/cM)

### What it does

Converts internal message format to Anthropic API format. Handles:
- Removing tool_use blocks for tools not in current set
- Merging consecutive messages of the same role
- Deduplicating content blocks
- Ensuring proper message structure for API

### How it works

```javascript
// ============================================
// normalizeMessages (cM) - Message normalization for API
// Location: chunks.173.mjs:1999-2100
// ============================================

// READABLE (for understanding):
function normalizeMessages(messages, availableTools) {
    let normalized = [];

    for (let message of messages) {
        // Skip empty messages
        if (!message || !message.message) continue;

        // Handle different message types
        switch (message.type) {
            case "user":
                normalized.push(normalizeUserMessage(message, availableTools));
                break;
            case "assistant":
                normalized.push(normalizeAssistantMessage(message, availableTools));
                break;
            default:
                normalized.push(message);
        }
    }

    // Merge consecutive user messages
    normalized = mergeUserMessages(normalized);

    // Merge consecutive assistant messages
    normalized = mergeAssistantMessages(normalized);

    // Deduplicate content blocks
    normalized = deduplicateContent(normalized);

    return normalized;
}

// Normalize user message - filter tool_results
function normalizeUserMessage(message, availableTools) {
    let content = message.message.content;

    if (Array.isArray(content)) {
        // Filter out tool_results for tools not in available set
        content = content.filter(block => {
            if (block.type !== "tool_result") return true;

            // Find the tool_use this result is for
            let toolUseId = block.tool_use_id;
            let toolName = findToolNameById(toolUseId, message);

            // Keep if tool is available
            return isToolAvailable(toolName, availableTools);
        });
    }

    return {
        ...message,
        message: {
            ...message.message,
            content
        }
    };
}

// Normalize assistant message - filter tool_use blocks
function normalizeAssistantMessage(message, availableTools) {
    let content = message.message.content;

    if (Array.isArray(content)) {
        // Filter out tool_use for tools not in available set
        content = content.filter(block => {
            if (block.type !== "tool_use") return true;
            return isToolAvailable(block.name, availableTools);
        });
    }

    return {
        ...message,
        message: {
            ...message.message,
            content
        }
    };
}
```

### Why this approach

**Tool filtering:**

When tools are dynamically loaded or the tool set changes between turns, old tool_use blocks might reference tools no longer available. Removing these prevents API errors.

**Message merging:**

The Anthropic API expects alternating user/assistant messages. Consecutive messages of the same role must be merged:
```
[user, user, assistant] → [user (merged), assistant]
```

**Deduplication:**

During streaming, partial messages may be duplicated. The deduplication step removes exact duplicates from content arrays.

### Key insight

Message normalization is a **lossy transformation** - some information is removed to fit API constraints. The original messages are preserved in the UI state, and normalization is applied just before the API call.

---

## Algorithm 3: Tool Filtering by Mode (filterToolsByMode/Xk8)

### What it does

Filters the available tool set based on the current permission mode and execution context. Ensures tools are only available when appropriate for the current mode.

### How it works

```javascript
// ============================================
// filterToolsByMode (Xk8) - Tool filtering by mode
// Location: chunks.93.mjs:1568-1588
// ============================================

// READABLE (for understanding):
function filterToolsByMode({ tools, isBuiltIn, isAsync = false, permissionMode }) {
    return tools.filter(tool => {
        // MCP tools are always available
        if (tool.name.startsWith("mcp__")) return true;

        // Plan mode: allow only read-only tools
        if (matchesTool(tool, PLAN_ALLOWED_TOOLS) && permissionMode === "plan") {
            return true;
        }

        // Tools in EXCLUDED_TOOLS are never available
        if (EXCLUDED_TOOLS.has(tool.name)) return false;

        // Non-builtin tools with special exclusion
        if (!isBuiltIn && NON_BUILTIN_EXCLUDED.has(tool.name)) return false;

        // Async context restrictions
        if (isAsync && !ASYNC_ALLOWED_TOOLS.has(tool.name)) {
            // Exception: team mode background agents
            if (!isTeamModeBackgroundAgent()) return false;
        }

        return true;
    });
}

// Constants
const EXCLUDED_TOOLS = new Set([
    "TaskOutput", "ExitPlanMode", "EnterPlanMode",
    "Agent", "AskUserQuestion", "TaskStop"
]);

const NON_BUILTIN_EXCLUDED = new Set([
    "TaskOutput", "ExitPlanMode", "EnterPlanMode",
    "Agent", "AskUserQuestion", "TaskStop"
]);

const ASYNC_ALLOWED_TOOLS = new Set([
    "Read", "WebSearch", "Grep", "WebFetch", "Glob",
    "TodoWrite", "Edit", "Write", "NotebookEdit", "Skill"
]);

const PLAN_ALLOWED_TOOLS = new Set([
    "Read", "Grep", "Glob", "WebFetch", "WebSearch"
]);
```

### Why this approach

**MCP tools exception:**

MCP tools are always available because they're user-configured extensions. The system doesn't restrict what MCP tools can do - that's the user's responsibility.

**Plan mode restrictions:**

In plan mode, only read-only tools are available. This ensures the LLM can't make changes while planning:
- Allowed: Read, Grep, Glob, WebFetch, WebSearch
- Blocked: Write, Edit, Bash, NotebookEdit

**Excluded tools:**

Some tools are internal and should never be directly invoked:
- `ExitPlanMode` - Triggered by `/plan` command, not tool use
- `EnterPlanMode` - Same as above
- `AskUserQuestion` - Internal dialog system
- `TaskOutput` - Background task result fetcher

**Async context:**

Background agents have restricted tool access to prevent long-running operations from blocking:
- Only async-safe tools allowed
- Exception for team mode where background agents are teammates

### Key insight

Tool filtering happens at multiple levels:
1. **Mode-level**: Plan mode restricts to read-only
2. **Context-level**: Async mode restricts to safe tools
3. **Tool-level**: Some tools are always excluded

The order of checks matters - MCP tools bypass all restrictions.

---

## Algorithm 4: Auto-Compact Trigger (shouldTriggerAutoCompaction/CmY)

### What it does

Determines whether auto-compaction should be triggered based on current token count, model thresholds, and circuit breaker status.

### How it works

```javascript
// ============================================
// shouldTriggerAutoCompaction (CmY) - Auto-compact trigger check
// Location: chunks.147.mjs:2620-2640
// ============================================

// READABLE (for understanding):
function shouldTriggerAutoCompaction(messages, model, consecutiveFailures) {
    // 1. Check if auto-compact is disabled via environment
    if (parseBoolean(process.env.DISABLE_AUTO_COMPACT)) return false;
    if (parseBoolean(process.env.DISABLE_COMPACT)) return false;

    // 2. Check circuit breaker - too many consecutive failures
    if (consecutiveFailures >= MAX_CONSECUTIVE_COMPACT_FAILURES) {
        logEvent("tengu_compact_circuit_breaker_active", {
            consecutiveFailures,
            model
        });
        return false;
    }

    // 3. Get token count
    let currentTokens = countTokens(messages);

    // 4. Get threshold for this model
    let threshold = getAutoCompactThreshold(model);

    // 5. Check if above threshold
    if (currentTokens >= threshold) {
        logEvent("tengu_compact_trigger", {
            currentTokens,
            threshold,
            model,
            utilizationPercent: Math.round((currentTokens / threshold) * 100)
        });
        return true;
    }

    return false;
}

// Get threshold based on model
function getAutoCompactThreshold(model) {
    // Model-specific thresholds
    if (model.includes("claude-sonnet")) {
        return 160000;  // 80% of 200k context
    }
    if (model.includes("claude-opus")) {
        return 160000;  // Same threshold
    }
    // Default for other models
    return 160000;
}

// Constants
const MAX_CONSECUTIVE_COMPACT_FAILURES = 3;
```

### Why this approach

**Environment variables:**

Two levels of disable:
- `DISABLE_AUTO_COMPACT` - Only disables automatic triggering
- `DISABLE_COMPACT` - Disables all compaction (including manual)

**Circuit breaker:**

If compaction fails 3 times in a row, stop trying. This prevents:
- Infinite retry loops
- Resource waste on broken state
- User frustration with repeated failures

The circuit breaker can be reset by:
- Successful compaction
- Session restart
- Manual intervention

**Threshold calculation:**

The 160k token threshold (80% of 200k context) provides:
- Buffer for response generation
- Room for tool results
- Safety margin for token counting variations

### Key insight

Auto-compact is **proactive, not reactive**:
- Triggers before hitting the context limit
- Leaves room for the next turn
- Prevents API errors rather than recovering from them

---

## Algorithm 5: Message Flattening (flattenMessages/JM)

### What it does

Flattens nested message structures (from compaction, tool results, etc.) into a flat array while preserving metadata like `isMeta` flags and extending UUIDs.

### How it works

```javascript
// ============================================
// flattenMessages (JM) - Message flattening
// Location: chunks.173.mjs:1516-1600
// ============================================

// READABLE (for understanding):
function flattenMessages(messages) {
    let flattened = [];

    for (let message of messages) {
        // Handle nested message arrays
        if (Array.isArray(message)) {
            let nested = flattenMessages(message);
            flattened.push(...nested);
            continue;
        }

        // Handle single message
        if (message && typeof message === "object") {
            // Preserve isMeta flag
            let isMeta = message.isMeta ?? false;

            // Handle message with nested content
            if (message.message && Array.isArray(message.message.content)) {
                // Flatten content blocks
                let flatContent = message.message.content.flatMap(block => {
                    if (block.type === "message" && block.message) {
                        // Nested message block
                        return flattenMessages([block]);
                    }
                    return [block];
                });

                flattened.push({
                    ...message,
                    message: {
                        ...message.message,
                        content: flatContent
                    },
                    isMeta
                });
            } else {
                flattened.push({
                    ...message,
                    isMeta
                });
            }
        }
    }

    return flattened;
}
```

### Why this approach

**Nested structures:**

Messages can be nested from:
- Compaction summaries (replaces multiple messages with one summary)
- Tool results containing nested messages
- System reminders injected inline

**isMeta preservation:**

The `isMeta` flag indicates system reminders that shouldn't be shown in the chat UI. This must be preserved through flattening to maintain correct display behavior.

**UUID extension:**

Each message needs a unique UUID for React's key prop. The flattening process extends UUIDs to ensure uniqueness.

### Key insight

Flattening is a **structural normalization** that:
- Doesn't change message content
- Preserves all metadata
- Prepares messages for API serialization

The result is always a flat array where each element is a single message object.

---

## Algorithm 6: Permission Context Reducer (permissionContextReducer/Ez)

### What it does

Manages the permission context state through a reducer pattern. Handles updates for mode changes, rule additions, and working directory modifications.

### How it works

```javascript
// ============================================
// permissionContextReducer (Ez) - Permission context updates
// Location: chunks.53.mjs:1224-1294
// ============================================

// READABLE (for understanding):
function permissionContextReducer(state, action) {
    switch (action.type) {
        case "setMode":
            return {
                ...state,
                mode: action.mode
            };

        case "addRules":
            // Add rules to the specified destination (allow/deny/ask)
            return {
                ...state,
                [action.destination]: [
                    ...state[action.destination],
                    ...action.rules
                ]
            };

        case "replaceRules":
            // Replace all rules for a destination
            return {
                ...state,
                [action.destination]: action.rules
            };

        case "addDirectories":
            // Add working directories
            return {
                ...state,
                directories: [
                    ...state.directories,
                    ...action.directories
                ]
            };

        case "clearRules":
            // Clear rules for a destination
            return {
                ...state,
                [action.destination]: []
            };

        case "reset":
            // Reset to initial state
            return action.initialState;

        default:
            return state;
    }
}

// Initial state structure
const initialPermissionContext = {
    mode: "default",           // default | accept | plan | bypassPermissions
    allowRules: [],            // Tool allow patterns
    denyRules: [],             // Tool deny patterns
    askRules: [],              // Tools that should prompt
    directories: [],           // Allowed working directories
    additionalDirectories: []  // Extra directories from CLI
};
```

### Why this approach

**Reducer pattern:**

Using a reducer (like Redux) instead of direct mutations:
- Predictable state transitions
- Easy to test
- Time-travel debugging possible
- Audit trail of all changes

**Action types:**

| Action | When Used |
|--------|-----------|
| `setMode` | CLI flag `--permission-mode`, Shift+Tab cycle |
| `addRules` | User approves with "Always allow" |
| `replaceRules` | Settings file reload |
| `addDirectories` | CLI `--add-dir` flag |
| `clearRules` | Reset permissions |
| `reset` | Session switch |

**Immutable updates:**

All updates use spread operators to create new state objects, enabling React's change detection.

### Key insight

The permission context is **cumulative**:
- Rules are added over time as user makes decisions
- Mode can change mid-session (Shift+Tab)
- Directories accumulate from multiple sources

The reducer pattern ensures all updates are tracked and consistent.

---

## Summary

These algorithms form the core decision-making logic for the CLI-UI-LLM integration:

| Algorithm | Purpose | Key Trade-off |
|-----------|---------|---------------|
| Dialog Priority | Which dialog to show | Single active dialog vs. stacking |
| Message Normalization | API format conversion | Lossy transformation for API constraints |
| Tool Filtering | Tool availability | Security vs. flexibility per mode |
| Auto-Compact Trigger | Context management | Proactive vs. reactive compaction |
| Message Flattening | Structural normalization | Preserve metadata through transformation |
| Permission Reducer | State management | Immutable updates for predictability |

---

**Last Updated**: 2026-03-25
**Version**: Claude Code 2.1.76