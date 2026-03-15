# Fast Mode Implementation

## Overview

Fast Mode is a feature in Claude Code v2.1.38 that allows users to switch to a more optimized, lower-latency model path for simpler tasks. It is typically tied to smaller Claude models like `claude-3-5-haiku`. The feature is accessible via the `/fast` slash command.

## Key Components

### 1. Model Routing

Fast Mode is not just a UI toggle; it changes the model selection logic in the main loop:

- **Target Model**: Determined by the environment variable `ANTHROPIC_SMALL_FAST_MODEL` or a hardcoded default (likely `claude-3-5-haiku`).
- **State Tracking**: The `fast_mode_state` is tracked within the `AgentLoop` state machine (`chunks.179.mjs`).

### 2. UI Integration

- **Toggle**: The `/fast` command toggles the `isFastModeEnabled` flag in the user's settings.
- **Status Display**: The UI shows a "Fast mode is ON" indicator when active (`chunks.153.mjs:1589`).
- **Hint**: If the user is on a slow model, the UI suggests: "Use /fast to turn on Fast mode".

### 3. Usage & Limits

Telemetry and logic in `chunks.47.mjs` suggest that Fast Mode has its own set of constraints:
- **Fallbacks**: If the fast model is unavailable, the system may fall back to the standard model.
- **Cooldowns**: Telemetry tracks fast-mode specific errors and cooldown periods.

## Key Decisions & Algorithms

### [Decision] Model Locking

**Why this approach**:
Fast Mode is explicitly restricted to specific "fast" models. If a user manually selects a different model (e.g., `opus`), Fast Mode is automatically turned off. This prevents conflicting model instructions and ensures the "fast" experience is consistent with the model's capabilities.

### [Algorithm] Dynamic Model Selection

**How it works**:
1. Before each turn, the `AgentLoop` checks the `fast_mode_state`.
2. If `true`:
   - It overrides the `mainLoopModel` with the configured "fast" model name.
   - It adds a telemetry flag indicating the turn used Fast Mode.
3. The model request is sent to the Anthropic API using the specialized model name.

**Why this approach**:
By abstracting the "Fast Mode" from the specific model name, Anthropic can update the underlying model (e.g., from haiku-3.5 to haiku-4) without requiring users to change their commands.

## Code Snippets

// ============================================
// ModelPickerFastMode - UI logic for Fast Mode hint
// Location: chunks.153.mjs:1585-1597
// ============================================

// ORIGINAL (for source lookup):
i4() ? w ? A4.createElement(I, {
    marginBottom: 1
}, A4.createElement(V, {
    dimColor: !0
}, "Fast mode is ", A4.createElement(V, {
    bold: !0
}, "ON"), " and available with", " ", $S, " only (/fast). Switching to other models turn off fast mode.")) : lH() && !Kv() ? A4.createElement(I, {
    marginBottom: 1
}, A4.createElement(V, {
    dimColor: !0
}, "Use ", A4.createElement(V, {
    bold: !0
}, "/fast"), " to turn on Fast mode (", $S, " only).")) : null : null

// READABLE (for understanding):
if (isFastModeAvailable()) {
    if (isFastModeEnabled) {
        return (
            <Box marginBottom={1}>
                <Text dimColor>
                    Fast mode is <Text bold>ON</Text> and available with {FAST_MODEL_NAME} only (/fast). 
                    Switching to other models turns off fast mode.
                </Text>
            </Box>
        );
    } else if (shouldShowFastModeHint()) {
        return (
            <Box marginBottom={1}>
                <Text dimColor>
                    Use <Text bold>/fast</Text> to turn on Fast mode ({FAST_MODEL_NAME} only).
                </Text>
            </Box>
        );
    }
}

// Mapping: i4→isFastModeAvailable, w→isFastModeEnabled, $S→FAST_MODEL_NAME

## Related Symbols

- `FAST_MODEL_NAME` (`$S`) - The model used for fast mode.
- `isFastModeAvailable` (`i4`) - Availability check.
- `fast_mode_state` - Loop state.

## Location References

- `chunks.153.mjs:1585` - UI Status.
- `chunks.179.mjs` - Agent loop integration.
- `chunks.149.mjs` - Environment variable configuration.
- `chunks.47.mjs` - Telemetry and fallbacks.
