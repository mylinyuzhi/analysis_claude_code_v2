# Thinking Mode and Budget Management Analysis

## Module Overview

Claude Code v2.1.38 natively supports "Thinking Mode" (Extended Thinking). This allows the model to output its internal reasoning process in a dedicated block before producing tool calls or text responses. The system manages a "Thinking Budget" and introduces "Adaptive Thinking" and "Effort Levels" to control the depth of reasoning.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key state keys and headers:
- `THINKING_BETA_1`: `interleaved-thinking-2025-05-14`
- `THINKING_BETA_2`: `adaptive-thinking-2026-01-28` (Adaptive Thinking)
- `EFFORT_BETA`: `effort-2025-11-24` (Effort Control)
- `maxThinkingTokens`: The token budget for internal reasoning.
- `effortValue`: Current effort level (`low`, `medium`, `high`, `max`).
- `thinkingEnabled`: Toggle in the UI/AppState.

## Thinking Lifecycle

1.  **Activation**: Thinking is enabled if the model supports it and `thinkingEnabled` is true.
2.  **Adaptive Mode**: v2.1.38 prefers `thinking: { type: "adaptive" }` which allows the model to dynamically scale its reasoning.
3.  **Effort Injection**: If an `effortValue` is set, it is passed via the `effort` beta header.
4.  **Budgeting**: The `maxThinkingTokens` parameter is set. If the session is non-interactive or in `fast_mode`, this budget is often set to `0`.
5.  **Streaming**: The API returns blocks of type `thinking`. These are captured and displayed in the UI with a "Thinking..." spinner.

## Core Algorithms

### 1. Thinking Token Budgeting

Calculates the allowable token budget for reasoning to prevent the model from getting stuck in long loops.

====
// configureThinking - Logic for thinking budget and adaptive mode
// Location: chunks.169.mjs:862-875
====

// ORIGINAL (for source lookup):
L1 = Sn7() ?? w.effortValue ?? p17(w.model);
if (thinkingEnabled) {
    return {
        type: "adaptive",
        budget_tokens: Math.min(maxThinkingTokens, modelLimit - 1)
    };
}

// READABLE (for understanding):
function getThinkingConfig(appState, modelLimit) {
    if (!appState.thinkingEnabled || appState.fastMode) {
        return { type: "disabled" };
    }

    // Determine reasoning depth based on effort level
    let effort = appState.effortValue || "high";
    
    return {
        type: "adaptive", // Preferred in v2.1.38
        budget_tokens: Math.min(appState.maxThinkingTokens, modelLimit - 1),
        effort: effort
    };
}

// Mapping: Sn7→getGlobalEffort, effortValue→effortLevel

### 2. Effort Levels and Constraints

Claude Code defines a set of effort levels that influence the model's persistence and reasoning depth.

| Level | Description | Beta Header |
|-------|-------------|-------------|
| `low` | Minimal reasoning, fastest response. | `effort-2025-11-24` |
| `high`| Default. Balanced reasoning and speed. | `effort-2025-11-24` |
| `max` | Maximum reasoning depth. Bypasses some safety timeouts. | `effort-2025-11-24` |

## UI Representation

In the terminal UI (Ink), thinking blocks are rendered as a collapsible "thought" section. The duration of thinking is tracked and displayed.

```javascript
const thinkingStatus = currentBlock === "thinking" 
    ? "thinking" 
    : `thought for ${Math.max(1, Math.round(duration / 1000))}s`;
```

## Impact on Tool Use

Thinking mode is particularly powerful for complex tool use. The model can reason about:
- **Search Strategy**: Planning which directories to `grep` based on initial findings.
- **Error Interpretation**: Analyzing stack traces before attempting a fix.
- **Refactoring**: Mapping dependencies before editing multiple files.

**Key insight:** v2.1.38 moves away from static reasoning limits to **Adaptive Thinking**. By combining `thinking: adaptive` with `effort` levels, Claude Code allows the model to "try harder" on difficult tasks without wasting tokens on simple ones.
