# Skill Usage Tracking - Deep Analysis (Claude Code 2.1.38)

## Overview

The skill usage tracking system monitors how frequently skills are invoked and provides a scoring mechanism that can be used for ranking and recommendations. This system helps identify which skills are most valuable to the user and could influence skill discovery and suggestion algorithms.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skill Usage Tracking section)

Key functions in this document:
- `recordSkillUsage` (xM6) - Record a skill invocation - chunks.130.mjs:1383-1397
- `getSkillUsageScore` (bM6) - Get decayed usage score - chunks.130.mjs:1399-1405
- `skillUsage` - State key for usage data - chunks.130.mjs

---

## Architecture Overview

```
Skill Usage Tracking Flow
─────────────────────────

LLM invokes skill "commit"
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│                recordSkillUsage("commit")                  │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 1. Get current usage data from state               │   │
│  │ 2. Increment usage count                           │   │
│  │ 3. Update lastUsedAt timestamp                     │   │
│  │ 4. Write back to state                             │   │
│  └────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
       │
       ▼
State update:
{
  skillUsage: {
    "commit": {
      usageCount: 5,
      lastUsedAt: 1709020800000
    }
  }
}
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│              getSkillUsageScore("commit")                  │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 1. Get usage data                                  │   │
│  │ 2. Calculate days since last use                   │   │
│  │ 3. Apply exponential decay (half-life: 7 days)     │   │
│  │ 4. Return: count × decay_factor                    │   │
│  └────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
       │
       ▼
Score: 5 × 0.85 = 4.25
```

---

## Implementation Details

### recordSkillUsage (xM6)

**What it does:** Records a skill invocation by incrementing the usage count and updating the timestamp.

**How it works:**
1. Retrieves current usage data from application state
2. Increments the usage count for the specified skill
3. Updates the lastUsedAt timestamp to now
4. Writes the updated data back to state (with change detection to avoid unnecessary updates)

```javascript
// ============================================
// recordSkillUsage - Record skill invocation
// Location: chunks.130.mjs:1383-1397
// ============================================

// ORIGINAL (for source lookup):
function xM6(A) {
    let K = f6().skillUsage?.[A],
        Y = Date.now(),
        z = (K?.usageCount ?? 0) + 1;
    if (!K || K.usageCount !== z || K.lastUsedAt !== Y) jA((w) => ({
        ...w,
        skillUsage: {
            ...w.skillUsage,
            [A]: {
                usageCount: z,
                lastUsedAt: Y
            }
        }
    }))
}

// READABLE (for understanding):
function recordSkillUsage(skillName) {
    // Get current usage data for this skill
    let currentData = getAppState().skillUsage?.[skillName];

    let now = Date.now();
    let newCount = (currentData?.usageCount ?? 0) + 1;

    // Only update if something changed (avoid unnecessary re-renders)
    if (!currentData ||
        currentData.usageCount !== newCount ||
        currentData.lastUsedAt !== now) {

        setAppState((state) => ({
            ...state,
            skillUsage: {
                ...state.skillUsage,
                [skillName]: {
                    usageCount: newCount,
                    lastUsedAt: now
                }
            }
        }));
    }
}

// Mapping: xM6→recordSkillUsage, f6→getAppState, jA→setAppState
```

**Key insight:** The change detection (`usageCount !== newCount || lastUsedAt !== now`) prevents unnecessary state updates. Since `now` is a timestamp with millisecond precision, the `lastUsedAt !== now` check will almost always be true, but the check exists for consistency.

### getSkillUsageScore (bM6)

**What it does:** Calculates a usage score that decays over time, giving higher weight to recently used skills.

**How it works:**
1. Retrieves usage data for the skill
2. Calculates days since last use
3. Applies exponential decay with 7-day half-life
4. Returns count × decay_factor, with minimum decay of 0.1

```javascript
// ============================================
// getSkillUsageScore - Get decayed usage score
// Location: chunks.130.mjs:1399-1405
// ============================================

// ORIGINAL (for source lookup):
function bM6(A) {
    let K = f6().skillUsage?.[A];
    if (!K) return 0;
    let Y = (Date.now() - K.lastUsedAt) / 86400000,
        z = Math.pow(0.5, Y / 7);
    return K.usageCount * Math.max(z, 0.1)
}

// READABLE (for understanding):
function getSkillUsageScore(skillName) {
    let data = getAppState().skillUsage?.[skillName];

    // No usage data = score of 0
    if (!data) return 0;

    // Calculate days since last use
    let daysSinceLastUse = (Date.now() - data.lastUsedAt) / 86400000;  // ms per day

    // Exponential decay with 7-day half-life
    // After 7 days: factor = 0.5
    // After 14 days: factor = 0.25
    // After 21 days: factor = 0.125
    let decayFactor = Math.pow(0.5, daysSinceLastUse / 7);

    // Apply minimum decay factor of 0.1 (after ~23 days, stops decaying)
    let clampedFactor = Math.max(decayFactor, 0.1);

    // Final score = usage count × decay factor
    return data.usageCount * clampedFactor;
}

// Mapping: bM6→getSkillUsageScore, f6→getAppState
```

---

## Decay Algorithm Analysis

### Half-Life Model

The system uses a half-life decay model where the decay factor halves every 7 days.

**Formula:**
```
decayFactor = 0.5 ^ (daysSinceLastUse / 7)
```

**Examples:**

| Days Since Use | Decay Factor | Example Score (5 uses) |
|----------------|--------------|------------------------|
| 0 (today) | 1.0 | 5.0 |
| 7 (1 week) | 0.5 | 2.5 |
| 14 (2 weeks) | 0.25 | 1.25 |
| 21 (3 weeks) | 0.125 | 0.625 |
| 30 (1 month) | ~0.06* | 0.5** |

*Below 0.1 threshold
**Clamped to 0.1 minimum, so 5 × 0.1 = 0.5

### Minimum Threshold

The `Math.max(z, 0.1)` ensures skills never fully "decay away". Even a skill used months ago retains 10% of its count-weighted score.

**Why this approach:**
- Prevents long-unused but valuable skills from disappearing completely
- Allows re-discovery of skills the user once found useful
- Provides a baseline for comparison with never-used skills (score: 0)

### Graph Visualization

```
Score over time (5 uses, no decay clamp):
Score
  5.0 ┤■
  4.0 ┤■■
  3.0 ┤■■■
  2.5 ┤■■■■     ← 7 days
  2.0 ┤■■■■■
  1.5 ┤■■■■■■
  1.25┤■■■■■■■  ← 14 days
  1.0 ┤■■■■■■■■
  0.5 ┤■■■■■■■■■■■■■ ← 30 days (with 0.1 clamp)
  0.0 ┼────────────────────
      0  7  14 21 28 35 Days
```

---

## State Structure

### skillUsage State Key

```typescript
interface AppState {
    skillUsage?: {
        [skillName: string]: {
            usageCount: number;    // Number of times invoked
            lastUsedAt: number;    // Unix timestamp (ms)
        }
    }
}
```

### Example State

```javascript
{
    skillUsage: {
        "commit": {
            usageCount: 12,
            lastUsedAt: 1709020800000
        },
        "review-pr": {
            usageCount: 5,
            lastUsedAt: 1708500000000
        },
        "keybindings-help": {
            usageCount: 3,
            lastUsedAt: 1707000000000
        }
    }
}
```

---

## Usage in Codebase

### When recordSkillUsage is Called

The function is called in `SkillTool.call()` when the LLM invokes a skill:

```javascript
// From SkillTool.call (simplified)
async call({ skill, args }, context, ...) {
    let skillName = skill.trim().startsWith("/")
        ? skill.trim().substring(1)
        : skill.trim();

    // Record usage
    recordSkillUsage(skillName);

    // ... rest of execution
}
```

**Note:** Usage is recorded for both inline and forked execution modes.

### Potential Uses (Inferred)

While the current codebase primarily records usage, the `getSkillUsageScore` function suggests intended uses:

1. **Skill Ranking** - Order skills by score in UI
2. **Autocomplete Priority** - Suggest frequently-used skills first
3. **Recommendation Engine** - "You might also like..."
4. **Usage Analytics** - Identify most valuable skills

---

## Design Rationale

### Why Exponential Decay?

Exponential decay provides:
1. **Recent emphasis** - Skills used today score higher than skills used last week
2. **Forgiveness** - A long-unused skill can recover quickly with new usage
3. **Smooth curve** - No sudden jumps in score

### Why 7-Day Half-Life?

Seven days is a reasonable balance:
- Short enough that weekly usage maintains significance
- Long enough that occasional usage isn't penalized heavily
- Aligns with typical work week patterns

### Why Minimum Threshold?

The 0.1 minimum prevents:
1. **Complete decay** - Never-used skills (score: 0) are distinct from once-used skills
2. **Cold start problem** - A skill with history has an advantage over new skills
3. **Rediscovery** - Users can find previously-valuable skills in suggestions

### Alternative Approaches Considered

1. **Linear decay** - Simpler but less realistic (recent vs. older should be non-linear)
2. **No decay** - Count only, but this overweights old usage
3. **Full reset after N days** - Loses valuable history

---

## Debugging

### Check Current Usage Data

```javascript
// In browser console
let state = getAppState();
console.log(state.skillUsage);
```

### Check Specific Skill Score

```javascript
console.log(getSkillUsageScore("commit"));
```

### Simulate Decay

```javascript
// Skill used 14 days ago with 5 uses
let fakeData = {
    usageCount: 5,
    lastUsedAt: Date.now() - (14 * 86400000)
};
let days = (Date.now() - fakeData.lastUsedAt) / 86400000;
let decay = Math.pow(0.5, days / 7);
console.log(5 * Math.max(decay, 0.1));  // ~0.625 (without clamp)
```

### Reset Usage Data

```javascript
setAppState((state) => ({
    ...state,
    skillUsage: {}
}));
```