# Effort Command - Deep Analysis (Claude Code 2.1.76)

> Complete analysis of the `/effort` slash command for controlling model reasoning depth.
> **NEW in v2.1.76** - Allows users to control the reasoning effort level for model responses.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Effort Level section)

Key functions in this document:
- `EFFORT_SLASH_COMMAND` (Q0q) - Command definition - chunks.166.mjs:1436
- `handleEffortCommand` (X4z) - Command handler - chunks.166.mjs:1399
- `setEffortLevel` (O4z) - Persist effort setting - chunks.166.mjs:1319
- `getEffortValue` (p7z) - State selector for current effort - chunks.166.mjs:464
- `getEffortDescription` (KO8) - Human-readable effort description - chunks.166.mjs
- `EFFORT_LEVELS` (w4z) - Valid effort level values - chunks.166.mjs

---

## Overview

### What It Does

The `/effort` command allows users to control the reasoning depth and thoroughness of model responses. Higher effort levels result in more comprehensive reasoning but may take longer and cost more.

### Command Syntax

```
/effort [low|medium|high|max|auto]
```

**Arguments:**
- No argument or `status` or `current`: Display current effort level
- `low`: Quick, straightforward implementation
- `medium`: Balanced approach with standard testing
- `high`: Comprehensive implementation with extensive testing
- `max`: Maximum capability with deepest reasoning (Opus 4.6 only)
- `auto`: Use the default effort level for the current model

---

## Effort Levels

| Level | Description | Model Support | Use Case |
|-------|-------------|---------------|----------|
| `low` | Quick, straightforward implementation | All models | Simple tasks, quick answers |
| `medium` | Balanced approach with standard testing | All models | Default for most tasks |
| `high` | Comprehensive implementation with extensive testing | All models | Complex features, critical code |
| `max` | Maximum capability with deepest reasoning | Opus 4.6 only | Most complex problems, architecture design |
| `auto` | Model default (resets to model's preferred level) | All models | Reset to default behavior |

---

## Implementation

### Command Definition

```javascript
// ============================================
// EFFORT_SLASH_COMMAND - /effort command definition
// Location: chunks.166.mjs:1436-1450
// ============================================

// ORIGINAL (for source lookup):
Q0q = {
    type: "local-jsx",
    name: "effort",
    description: "Set effort level for model usage",
    isEnabled: () => !0,
    isHidden: !1,
    argumentHint: "[low|medium|high|max|auto]",
    get immediate() {
        return XN6()
    },
    load: () => Promise.resolve().then(() => (p0q(), F0q)),
    userFacingName() {
        return "effort"
    }
}

// READABLE (for understanding):
const EFFORT_SLASH_COMMAND = {
    type: "local-jsx",
    name: "effort",
    description: "Set effort level for model usage",
    isEnabled: () => true,
    isHidden: false,
    argumentHint: "[low|medium|high|max|auto]",
    get immediate() {
        return isImmediateMode();
    },
    load: () => Promise.resolve().then(() => loadEffortModule()),
    userFacingName() {
        return "effort";
    }
};

// Mapping: Q0q→EFFORT_SLASH_COMMAND, XN6→isImmediateMode
```

### Command Handler

```javascript
// ============================================
// handleEffortCommand - Process /effort command
// Location: chunks.166.mjs:1399-1410
// ============================================

// ORIGINAL (for source lookup):
async function X4z(A, q, K) {
    if (K = K?.trim() || "", w4z.includes(K)) {
        A(`Usage: /effort [low|medium|high|max|auto]

Effort levels:
- low: Quick, straightforward implementation
- medium: Balanced approach with standard testing
- high: Comprehensive implementation with extensive testing
- max: Maximum capability with deepest reasoning (Opus 4.6 only)
- auto: Use the default effort level for your model`);
        return
    }
    if (!K || K === "current" || K === "status") return vr6.createElement(J4z, {
        onDone: A
    });
    // ... additional logic
}

// READABLE (for understanding):
async function handleEffortCommand(onDone, context, args) {
    args = args?.trim() || "";

    // Show usage if invalid argument
    const VALID_LEVELS = ["low", "medium", "high", "max", "auto"];
    if (args && !VALID_LEVELS.includes(args)) {
        onDone(`Usage: /effort [low|medium|high|max|auto]

Effort levels:
- low: Quick, straightforward implementation
- medium: Balanced approach with standard testing
- high: Comprehensive implementation with extensive testing
- max: Maximum capability with deepest reasoning (Opus 4.6 only)
- auto: Use the default effort level for your model`);
        return;
    }

    // Show current status if no args
    if (!args || args === "current" || args === "status") {
        return renderEffortStatus({ onDone });
    }

    // Set effort level
    const result = setEffortLevel(args);
    return renderEffortUpdate({ result, onDone });
}

// Mapping: X4z→handleEffortCommand, w4z→EFFORT_LEVELS
```

### Set Effort Level

```javascript
// ============================================
// setEffortLevel - Persist effort setting
// Location: chunks.166.mjs:1319-1336
// ============================================

// ORIGINAL (for source lookup):
function O4z(A) {
    let q = nq6(A);
    if (q !== void 0) {
        let z = TA("userSettings", {
            effortLevel: q
        });
        if (z.error) return {
            message: `Failed to set effort level: ${z.error.message}`
        }
    }
    let K = KO8(A);
    return {
        message: `Set effort level to ${A}${q!==void 0?"":" (this session only)"}: ${K}`,
        effortUpdate: {
            value: A
        }
    }
}

// READABLE (for understanding):
function setEffortLevel(level) {
    // Try to persist to user settings
    const settingsValue = normalizeEffortValue(level);
    if (settingsValue !== undefined) {
        const result = updateUserSettings("userSettings", {
            effortLevel: settingsValue
        });
        if (result.error) {
            return {
                message: `Failed to set effort level: ${result.error.message}`
            };
        }
    }

    // Return success with description
    const description = getEffortDescription(level);
    return {
        message: `Set effort level to ${level}${settingsValue !== undefined ? "" : " (this session only)"}: ${description}`,
        effortUpdate: {
            value: level
        }
    };
}

// Mapping: O4z→setEffortLevel, nq6→normalizeEffortValue, TA→updateUserSettings, KO8→getEffortDescription
```

---

## State Management

### State Keys

| Key | Scope | Description |
|-----|-------|-------------|
| `effortValue` | Session | Current effort level for this session |
| `effortLevel` | Settings | Persisted effort preference |

### State Selectors

```javascript
// ============================================
// getEffortValue - State selector
// Location: chunks.166.mjs:464
// ============================================

// ORIGINAL (for source lookup):
function p7z(A) {
    return A.effortValue
}

// READABLE (for understanding):
function getEffortValue(state) {
    return state.effortValue;
}

// Mapping: p7z→getEffortValue
```

### State Updates

```javascript
// In D4z (renderEffortUpdate):
if (result.effortUpdate) {
    setState((prevState) => ({
        ...prevState,
        effortValue: result.effortUpdate.value
    }));
}
```

---

## User Experience

### Display Current Effort

```
/effort
Current effort level: high (Comprehensive implementation with extensive testing)
```

### Set Effort Level

```
/effort high
Set effort level to high: Comprehensive implementation with extensive testing
```

### Reset to Auto

```
/effort auto
Effort level set to auto
```

### Invalid Argument

```
/effort invalid
Usage: /effort [low|medium|high|max|auto]

Effort levels:
- low: Quick, straightforward implementation
- medium: Balanced approach with standard testing
- high: Comprehensive implementation with extensive testing
- max: Maximum capability with deepest reasoning (Opus 4.6 only)
- auto: Use the default effort level for your model
```

---

## Model Integration

### Effort Beta Header

When effort level is set, it's communicated to the model via the `effort` parameter in API requests:

```javascript
// In LLM request building (chunks.169.mjs)
if (effortValue) {
    request.effort = effortValue;
}
```

### Model Support

| Model | Supports Effort | Default Level |
|-------|-----------------|---------------|
| Claude Opus 4.6 | Yes (all levels) | auto |
| Claude Sonnet 4.6 | Yes (low/medium/high) | auto |
| Claude Haiku 4.5 | Yes (low/medium/high) | auto |

**Note:** `max` effort is only available for Opus 4.6. Other models will use `high` as the maximum.

---

## Related Settings

### User Settings

```json
{
  "effortLevel": "high"
}
```

### Environment Variables

None directly related. Effort level is stored in user settings.

---

## Summary

The `/effort` command provides:

1. **Control**: Fine-grained control over reasoning depth
2. **Flexibility**: Session-level override or persistent setting
3. **Transparency**: Clear descriptions of each level
4. **Safety**: Automatic fallback for unsupported models

**Key Design Decisions:**
- `max` restricted to Opus 4.6 to ensure quality results
- `auto` resets to model's preferred level
- Setting persists across sessions when saved to user settings
- Invalid arguments show usage help