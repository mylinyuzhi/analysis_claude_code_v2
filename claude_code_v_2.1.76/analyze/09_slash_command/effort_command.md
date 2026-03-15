# `/effort` Command — Thinking Effort Control

## Overview

The `/effort` command allows users to set the thinking effort level for subsequent LLM responses. In v2.1.76, the effort system was redesigned:

- **Levels**: `low`, `medium`, `high` (the previous `max` level was removed)
- **Symbols**: `○` (low), `◐` (medium), `●` (high) — displayed in the status line
- **Auto-reset**: `/effort auto` resets to the model's default (no explicit budget override)
- **Keyword trigger**: The word `ultrathink` anywhere in a user message triggers high effort for that turn only (without permanently changing the session effort)
- **Display**: Current effort level shown in the status line between prompts

This replaces the previous v2.1.38 design which had `low/medium/high/max` levels and did not have an `auto` reset option.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Thinking, CLI)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components

Key functions in this document:
- `effortCommand` - The `/effort` command definition object
- `setEffortLevel` - Updates effort level in app state
- `getEffortBudget` - Converts level string to token budget integer
- `effortLevelSymbol` - Returns the display symbol (○ / ◐ / ●) for an effort level
- `detectUltrathink` - Scans user message for the "ultrathink" keyword

---

## Effort Level Architecture (v2.1.76)

### Levels and Their Meanings

**What it does:** The effort system maps named levels to thinking token budgets passed to the Anthropic API.

**How it works:**

| Level | Symbol | Token Budget | Use Case |
|-------|--------|-------------|----------|
| `low` | `○` | ~1,000 tokens | Quick responses, simple tasks |
| `medium` | `◐` | ~8,000 tokens | Default balanced thinking |
| `high` | `●` | ~32,000 tokens | Complex problems, deep analysis |
| `auto` | (none) | Model default | No override, model decides |

**Why `max` was removed:**
The previous `max` level (which allocated the maximum allowed thinking budget) was removed because:
1. It frequently caused rate limit issues on models with limited thinking quotas
2. The benefit over `high` was marginal in most use cases
3. Users had no clear signal of when `max` was appropriate vs. `high`
4. The `ultrathink` keyword now provides a single-turn `max`-equivalent without locking in the high budget for all subsequent turns

**Design rationale for `auto`:**
`auto` is distinct from `low`/`medium`/`high` in that it passes no `thinking` parameter to the API, allowing the model to allocate thinking budget based on its own assessment of question complexity. This is the recommended default for users who don't have specific performance requirements.

### `/effort` Command Definition

```javascript
// ============================================
// effortCommand - /effort slash command definition
// Location: chunks.161.mjs (effort command section)
// ============================================

// READABLE (for understanding):
const effortCommand = {
    type: "local-jsx",
    name: "effort",
    description: "Set thinking effort level (low/medium/high/auto)",
    isEnabled: () => true,
    isHidden: false,
    userFacingName() { return "effort" },
    source: "builtin",
    async call(args, { onDone }) {
        const level = args.trim().toLowerCase();
        if (!["low", "medium", "high", "auto"].includes(level)) {
            onDone(`Unknown effort level: "${level}". Valid: low, medium, high, auto`, { display: "user" });
            return;
        }
        setEffortLevel(level);  // update app state
        const symbol = effortLevelSymbol(level);
        const description = level === "auto"
            ? "Reset to model default"
            : `Effort set to ${level} ${symbol}`;
        onDone(description, { display: "system" });  // system: not visible in main conversation
    }
}
```

### getEffortBudget — Level to Token Budget Mapping

**What it does:** Converts a named effort level to an integer thinking token budget.

**How it works:**
```javascript
function getEffortBudget(level) {
    switch (level) {
        case "low":    return 1024;
        case "medium": return 8192;
        case "high":   return 32768;
        case "auto":   return null;  // null = no override, model default
        default:       return null;
    }
}
```

**Key insight:** Returning `null` for `"auto"` means the `thinking` parameter is omitted from the API request entirely, not set to 0. Setting it to 0 would disable thinking; omitting it lets the model decide. This distinction matters for models that use thinking by default.

### effortLevelSymbol — Visual Status Indicator

**What it does:** Returns a Unicode symbol for display in the status line.

```javascript
function effortLevelSymbol(level) {
    switch (level) {
        case "low":    return "○";   // U+25CB WHITE CIRCLE
        case "medium": return "◐";   // U+25D0 CIRCLE WITH LEFT HALF BLACK
        case "high":   return "●";   // U+25CF BLACK CIRCLE
        default:       return "";    // "auto": no symbol shown
    }
}
```

**Why these symbols:** The circle filling visually conveys "fullness" — empty circle for low effort, half-filled for medium, fully filled for high. This is intuitive without requiring text labels in the compact status line.

---

## ultrathink Keyword Trigger

### What it does

When a user includes the word `ultrathink` anywhere in their message, the system automatically elevates the thinking budget to the maximum allowed for that single turn, without changing the session's persistent effort level.

### How it works

**Detection:**
```javascript
function detectUltrathink(messageText) {
    return /\bultrathink\b/i.test(messageText);
}
```

**Application:**
1. User types a message containing "ultrathink" (e.g., "ultrathink: analyze this complex algorithm")
2. `detectUltrathink` returns true
3. For this query only, the thinking budget is overridden to the model's maximum
4. After the response, the budget reverts to the session's configured effort level
5. No change to the `/effort` setting is made

**Why keyword-based (not flag-based):** The keyword approach allows users to naturally express "think extra hard about this" inline without switching to a menu or typing an additional command. The word `ultrathink` serves as a memorable, unambiguous signal.

**Why single-turn only:** Persistent maximum thinking would exhaust thinking quotas quickly. Single-turn override gives users the "think deeply about exactly this" capability while preventing runaway budget consumption.

**Design rationale for keyword vs. /effort max:** This replaces the old `max` level with a more ergonomic and less permanent mechanism. Users who previously kept `/effort max` set permanently will get the same effect per-turn by writing `ultrathink` in their message.

---

## Status Line Integration

The current effort level is displayed in the status line between prompts:

```
[○ low]  ← low effort
[◐]      ← medium effort (default, no label shown when at medium)
[● high] ← high effort
         ← auto (no indicator, model default)
```

When the agent is processing a message that triggered `ultrathink`, the status line shows:
```
[●● ultrathink]
```

This gives the user immediate feedback that their message will receive extended thinking.

---

## Integration with Thinking Budget System

The effort level feeds into the `buildThinkingBudget` function in the LLM query builder:

```javascript
function buildThinkingBudget(effortLevel, modelCapabilities) {
    const requestedBudget = getEffortBudget(effortLevel);

    if (requestedBudget === null) {
        // auto: no explicit budget, let model decide
        return null;
    }

    // Clamp to model's maximum allowed thinking tokens
    const maxBudget = modelCapabilities.maxThinkingTokens ?? 32768;
    return Math.min(requestedBudget, maxBudget);
}
```

**Clamping:** The requested budget is clamped to the model's actual maximum. If `high` (32,768) exceeds the model's limit, the model's limit is used. This prevents API errors from requesting more thinking tokens than the model supports.

---

## Comparison with v2.1.38

| Aspect | v2.1.38 | v2.1.76 |
|--------|---------|---------|
| Levels | low / medium / high / max | low / medium / high / auto |
| Reset to default | No direct reset; had to pick a level | `/effort auto` |
| Symbols | Not specified | ○ / ◐ / ● |
| Ultrathink | Not implemented | Keyword trigger in any message |
| Status display | Basic | Symbol in status line |
| Max behavior | Persistent `max` level | Single-turn via `ultrathink` keyword |
