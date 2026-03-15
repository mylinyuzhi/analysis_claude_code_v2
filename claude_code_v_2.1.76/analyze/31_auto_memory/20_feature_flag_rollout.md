# Feature Flag and Gradual Rollout System

## Overview

This document details the feature flag system and gradual rollout strategy for auto memory. The implementation uses a **5-level priority chain** to determine whether the feature is enabled, allowing for precise control over rollout, A/B testing, and emergency kill switches.

**Key insight**: The priority chain enables flexible rollout strategies — from full disable (env var) to user opt-in (setting) to gradual expansion (feature flag cohorts).

**Version**: Claude Code v2.1.76

---

## Feature Flag Configuration

### Flag Metadata

| Property | Value | Description |
|----------|-------|-------------|
| **Flag name** | `"tengu_oboe"` | Internal codename for auto memory feature |
| **Default value** | `false` | Disabled by default (research preview) |
| **Purpose** | Gradual rollout control | Enables A/B testing and emergency disable |
| **Scope** | Global (affects all users) | No per-user flag overrides in current implementation |

### Flag Storage Location

**Source**: Feature flag service (external)
**Local cache**: `~/.claude/feature_flags.json` (expires after TTL)
**Fallback**: `false` (if service unreachable)

---

## Enable Priority Chain (5 Levels)

### Priority Hierarchy

```
Priority 1 (Highest): Explicit env var disable
  |
Priority 2: Explicit env var enable (override)
  |
Priority 3: Remote mode requires explicit directory
  |
Priority 4: User setting preference
  |
Priority 5 (Lowest): Feature flag default
```

**Rule**: Higher priority overrides all lower priorities.

### Code Analysis: isAutoMemoryEnabled

```javascript
// ============================================
// isAutoMemoryEnabled - Feature enable check with priority chain
// Location: chunks.87.mjs:2194-2221
// ============================================

// ORIGINAL (for source lookup):
function y2() {
  // Priority 1
  if (process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY === "1") {
    return false;
  }

  // Priority 2
  if (process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY === "0") {
    return true;
  }

  // Priority 3
  if (yO1() && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
    return false;
  }

  // Priority 4
  if (userSettings.autoMemoryEnabled !== undefined) {
    return userSettings.autoMemoryEnabled;
  }

  // Priority 5
  return getFeatureFlag("tengu_oboe");
}

// READABLE (for understanding):
function isAutoMemoryEnabled() {
  // ========================================
  // Priority 1: Explicit env var disable
  // Hard disable via environment variable (overrides everything)
  // ========================================
  if (process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY === "1") {
    return false;
  }

  // ========================================
  // Priority 2: Explicit env var enable
  // Hard enable via environment variable (overrides setting and flag)
  // ========================================
  if (process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY === "0") {
    return true;
  }

  // ========================================
  // Priority 3: Remote mode directory requirement
  // Remote mode requires explicit memory directory
  // If remote mode is active but no directory specified, disable
  // ========================================
  if (isRemoteMode() && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
    return false;
  }

  // ========================================
  // Priority 4: User setting preference
  // User explicitly enabled/disabled via TUI toggle
  // ========================================
  if (userSettings.autoMemoryEnabled !== undefined) {
    return userSettings.autoMemoryEnabled;
  }

  // ========================================
  // Priority 5: Feature flag default
  // No explicit override, use feature flag value
  // Default: false (research preview, opt-in only)
  // ========================================
  return getFeatureFlag("tengu_oboe");
}

// Mapping: y2→isAutoMemoryEnabled, yO1→isRemoteMode
```

### Priority Level Details

#### Priority 1: Explicit Env Var Disable

**Condition**: `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`

**Use case**: Emergency kill switch, corporate policy enforcement

**Behavior**: Overrides all other settings — feature is completely disabled

```bash
# Corporate IT sets env var globally
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=1
# Even if user toggles ON in TUI, feature remains disabled
# Even if feature flag is true, feature remains disabled
```

**Rationale**:
- **Security**: Organizations can disable persistent storage
- **Compliance**: Prevent data retention in regulated environments
- **Testing**: Developers can force-disable during debugging

---

#### Priority 2: Explicit Env Var Enable

**Condition**: `CLAUDE_CODE_DISABLE_AUTO_MEMORY=0`

**Use case**: Developer testing, force-enable for specific users

**Behavior**: Overrides setting and feature flag — feature is always enabled

```bash
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=0
# Feature is enabled regardless of flag or setting
```

**Why "DISABLE" env var with "0" for enable?**
- Historical: Env var was originally boolean disable-only
- Backward compatible: `DISABLE=1` still works as expected
- Dual-purpose: Single env var controls both enable and disable

---

#### Priority 3: Remote Mode Directory Requirement

**Condition**: `isRemoteMode() && !CLAUDE_CODE_REMOTE_MEMORY_DIR`

**Use case**: Claude.ai remote sessions require explicit memory directory

**Behavior**: Disable auto memory if remote mode but no directory specified

```bash
# To enable in remote mode:
export CLAUDE_CODE_REMOTE_MEMORY_DIR=/shared/memory/path
```

**Rationale**:
- **Safety**: Prevent accidental memory writes to default local paths
- **Intentionality**: User must explicitly opt-in for remote memory
- **Isolation**: Avoid conflicts between local and remote memory

---

#### Priority 4: User Setting Preference

**Condition**: `userSettings.autoMemoryEnabled !== undefined`

**Use case**: User explicitly toggled feature via TUI `/memory` command

**Behavior**: Respect user's explicit preference (overrides feature flag)

```json
// ~/.claude/settings.json
{
  "userSettings": {
    "autoMemoryEnabled": true,
    "autoMemoryDirectory": "/custom/path/"
  }
}
```

**New in v2.1.59**: The `autoMemoryDirectory` field in `userSettings` is also read here as part of directory resolution, not enable/disable control. When `autoMemoryEnabled` is true, the directory path comes from `autoMemoryDirectory` if set.

---

#### Priority 5: Feature Flag Default

**Condition**: None of the above priorities apply

**Use case**: Default behavior, gradual rollout, A/B testing

**Behavior**: Use feature flag value from service (`tengu_oboe`)

```javascript
getFeatureFlag("tengu_oboe") // Returns true or false
```

**Rationale**:
- **Gradual rollout**: Incrementally enable for cohorts
- **A/B testing**: Randomly assign users to treatment/control
- **Emergency disable**: Flip flag to disable for all users

---

## Rollout Scenarios

### Scenario 1: Initial Launch (Research Preview)

**Configuration**:
- Feature flag: `tengu_oboe = false` (default)
- User setting: undefined (no one has toggled)
- Environment var: not set

**Behavior**: Feature disabled for all users

**How users enable**: Open `/memory` modal → Toggle auto memory ON

**Outcome**: **Opt-in only** — users must discover and enable manually

---

### Scenario 2: Gradual Expansion (10% Rollout)

**Configuration**:
- Feature flag: `tengu_oboe = true` for 10% of users (cohort A)
- Feature flag: `tengu_oboe = false` for 90% of users (cohort B)

**Behavior**:
- **Cohort A** (10%): Feature enabled by default (Priority 5)
- **Cohort B** (90%): Feature disabled by default (Priority 5)
- **Any user can still toggle** via TUI (Priority 4 overrides flag)

**Outcome**: **Gradual rollout** with opt-out option

---

### Scenario 3: Full Rollout (100% Enabled)

**Configuration**: Feature flag: `tengu_oboe = true` for all users

**Behavior**:
- **Users who never toggled**: Feature enabled (Priority 5)
- **Users who explicitly disabled**: Feature remains disabled (Priority 4 overrides)
- **Users who explicitly enabled**: Feature remains enabled (Priority 4 confirms)

**Outcome**: **Enabled by default** with user override capability

---

### Scenario 4: Emergency Disable (Kill Switch)

**Option A**: Flip `tengu_oboe = false` (all users, ~5 minutes via cache TTL)

**Option B**: Set `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` globally (instant, requires server config)

**Outcome**: **Emergency rollback** in case of critical bug

---

### Scenario 5: Corporate Policy Enforcement

**Configuration**:
- Environment var: `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` (set by IT)
- Feature flag: `tengu_oboe = true` (enabled for general public)
- User tries to toggle ON

**Behavior**: Feature remains disabled (Priority 1 overrides all)

**Outcome**: **Corporate override** prevents feature usage

---

## Research Preview Status

### What "Research Preview" Means

**Definition**: Experimental feature under active development, subject to breaking changes

**Implications**:
1. **No stability guarantees**: Memory format may change between versions
2. **Limited support**: May have rough edges or incomplete documentation
3. **Opt-in required**: Not enabled by default for most users
4. **Breaking changes allowed**: Future updates may require manual migration

### UI Indicators

**TUI toggle label**: "Auto-memory (research preview)"

---

## Verification Steps

### Test 1: Priority 1 - Env Var Disable

```bash
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=1
```

Start Claude Code. Ask agent: "Is auto memory enabled?" Expected: No.

### Test 2: Priority 2 - Env Var Enable

```bash
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=0
# Assume feature flag is false and user setting is undefined
```

Start Claude Code. Memory directory should be created:
```bash
ls -la ~/.claude/projects/*/memory/
```

### Test 3: Priority 4 - User Setting Overrides Flag

1. (Assume feature flag is false)
2. Open `/memory` modal → Toggle auto memory ON
3. Close modal, restart Claude Code
4. **Expected**: Feature remains enabled (setting persisted)

```bash
cat ~/.claude/settings.json | grep autoMemoryEnabled
# Expected: "autoMemoryEnabled": true
```

### Test 4: Priority Precedence Conflicts

```bash
# Priority 1: DISABLE=1
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=1

# Priority 4: User setting = true (manually set)
echo '{"userSettings":{"autoMemoryEnabled":true}}' > ~/.claude/settings.json
```

Start Claude Code. Expected: Disabled (Priority 1 overrides Priority 4).

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `isAutoMemoryEnabled` (y2) - Feature enable check with 5-level priority chain
- `isRemoteMode` (yO1) - Checks if running in remote session mode
- `getFeatureFlag` - Retrieves feature flag value from service

---

## Key Takeaways

1. **5-level priority chain**: Env var > Remote mode > User setting > Feature flag
2. **Research preview**: Opt-in only, disabled by default via feature flag
3. **Flexible rollout**: Supports gradual expansion, A/B testing, emergency disable
4. **User control**: Users can always override feature flag via TUI toggle
5. **Corporate override**: Environment variable enables policy enforcement
6. **Custom directory** (v2.1.59): `autoMemoryDirectory` in settings is separate from enable/disable but consulted during directory resolution at Priority 4

**Design rationale**:
- Flexible control: Multiple rollout strategies supported
- User agency: Explicit user preference overrides flag
- Safety: Emergency kill switch via env var
- Gradual adoption: Feature flag enables cohort-based rollout

**Trade-offs**:
- **Complexity vs Control**: More priorities = more flexibility but harder to reason about
- **Opt-in vs Opt-out**: Research preview defaults to opt-in (slower adoption, safer)
- **Env var semantics**: `DISABLE=0` for enable is confusing (backward compatibility trade-off)
