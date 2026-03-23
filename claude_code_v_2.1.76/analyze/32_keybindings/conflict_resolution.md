# Keybindings Conflict Resolution

## Overview

This document analyzes how Claude Code resolves conflicts between keybindings from multiple sources: default bindings, user configuration, and system-reserved shortcuts. The resolution system ensures predictable behavior while maximizing customization flexibility.

**Version**: Claude Code v2.1.76

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Keybindings

Key functions in this document:
- `resolveKeystroke` (Z$1) - Main keystroke matching orchestrator
- `findKeybindingForAction` (P$1) - Reverse lookup action → chord
- `flattenKeybindings` (X$1) - Converts nested bindings to flat array
- `keystrokesMatch` (W$1) - Compares two keystroke objects
- `isPrefixMatch` (jl3) - Checks if sequence is prefix of chord
- `isExactMatch` (Jl3) - Checks if sequence matches exactly

---

## 1. Binding Sources & Priority Chain

### 1.1 Three-Tier Source Hierarchy

Claude Code's keybinding system draws from three distinct sources:

| Priority | Source | Location | Override Behavior |
|----------|--------|----------|-------------------|
| 1 (Highest) | User Config | `~/.claude/keybindings.json` | Can override defaults |
| 2 | Default Bindings | `XW6` constant (chunks.89.mjs:2614) | Built-in, always present |
| 3 (Lowest) | System Reserved | Platform-specific lists | Cannot be overridden |

### 1.2 Merge Algorithm

**What it does:** Combines default bindings with user bindings, giving user bindings priority through array ordering.

**How it works:**
1. Default bindings are loaded first into the array
2. User bindings are appended after defaults
3. During resolution, the **last matching binding wins**

```javascript
// ============================================
// Merge strategy - User bindings appended last
// Location: chunks.89.mjs:3180-3185 (inferred)
// ============================================

// ORIGINAL (for source lookup):
let mergedBindings = [...defaultBindings, ...userBindings];

// READABLE (for understanding):
// Array order determines priority:
// [0...N-1] = default bindings
// [N...M]   = user bindings (higher priority)
// Resolution iterates through array, last match wins

// Example array:
// [
//   { context: "Chat", chord: [{key:"enter",...}], action: "chat:submit" },  // default
//   { context: "Chat", chord: [{key:"enter",...}], action: "insert_newline" } // user override
// ]
// Result: "insert_newline" wins (appears later)

// Mapping: defaultBindings→XW6, userBindings→parsed.bindings
```

**Why last-match-wins:**
- Simpler implementation than complex priority logic
- Natural support for user overrides
- Deterministic behavior (array order is stable)

---

## 2. Conflict Resolution Algorithm

### 2.1 Resolution Function (Z$1)

**What it does:** Given a keystroke sequence, active contexts, and all bindings, determines the action to execute.

**How it works:**

```javascript
// ============================================
// Z$1 - resolveKeystroke - Main matching orchestrator
// Location: chunks.65.mjs:758-795
// ============================================

// ORIGINAL (for source lookup):
function Z$1(A, q, K, Y, z) {
    if (q.escape && z !== null) return {
        type: "chord_cancelled"
    };
    let _ = Hl3(A, q);
    if (!_) {
        if (z !== null) return {
            type: "chord_cancelled"
        };
        return {
            type: "none"
        }
    }
    let w = z ? [...z, _] : [_],
        O = Y.filter((j) => K.includes(j.context));
    if (O.some((j) => j.chord.length > w.length && jl3(w, j))) return {
        type: "chord_started",
        pending: w
    };
    let H;
    for (let j of O)
        if (Jl3(w, j)) H = j;
    if (H) {
        if (H.action === null) return {
            type: "unbound"
        };
        return {
            type: "match",
            action: H.action
        }
    }
    if (z !== null) return {
        type: "chord_cancelled"
    };
    return {
        type: "none"
    }
}

// READABLE (for understanding):
function resolveKeystroke(inputStr, keyEvent, activeContexts, allBindings, pendingChord) {
    // STEP 1: Escape cancels any pending chord
    if (keyEvent.escape && pendingChord !== null) {
        return { type: "chord_cancelled" };
    }

    // STEP 2: Normalize the keystroke
    let normalizedKey = eventToKeystroke(inputStr, keyEvent);
    if (!normalizedKey) {
        // Invalid keystroke - cancel chord if in progress
        if (pendingChord !== null) {
            return { type: "chord_cancelled" };
        }
        return { type: "none" };
    }

    // STEP 3: Build current sequence (append to pending or start new)
    let currentSequence = pendingChord
        ? [...pendingChord, normalizedKey]
        : [normalizedKey];

    // STEP 4: Filter bindings by active contexts
    let contextualBindings = allBindings.filter(binding =>
        activeContexts.includes(binding.context)
    );

    // STEP 5: Check for PREFIX match (chord in progress)
    // If any binding has a longer chord that starts with current sequence
    if (contextualBindings.some(binding =>
        binding.chord.length > currentSequence.length &&
        isPrefixMatch(currentSequence, binding)
    )) {
        return {
            type: "chord_started",
            pending: currentSequence
        };
    }

    // STEP 6: Find EXACT match (last-match-wins due to for loop)
    let matchedBinding;
    for (let binding of contextualBindings) {
        if (isExactMatch(currentSequence, binding)) {
            matchedBinding = binding; // Overwrites previous matches
        }
    }

    if (matchedBinding) {
        // Null action = explicitly unbound
        if (matchedBinding.action === null) {
            return { type: "unbound" };
        }
        return {
            type: "match",
            action: matchedBinding.action
        };
    }

    // STEP 7: No match found
    if (pendingChord !== null) {
        return { type: "chord_cancelled" }; // Was trying to complete a chord
    }
    return { type: "none" }; // No binding found
}

// Mapping: Z$1→resolveKeystroke, A→inputStr, q→keyEvent, K→activeContexts, Y→allBindings, z→pendingChord, _→normalizedKey, w→currentSequence, O→contextualBindings, H→matchedBinding, Hl3→eventToKeystroke, jl3→isPrefixMatch, Jl3→isExactMatch
```

**Key insight - Last-Match-Wins Logic:**

The `for` loop in Step 6 does NOT break after finding a match:
```javascript
for (let binding of contextualBindings) {
    if (isExactMatch(currentSequence, binding)) {
        matchedBinding = binding; // Continues searching, overwrites
    }
}
```

This means the **last** binding in the filtered array wins, which is exactly what we want for user overrides.

---

## 3. Conflict Types & Resolution Examples

### 3.1 User Override of Default

**Scenario:** User wants `enter` to insert newline instead of submit.

**Configuration:**
```json
{
    "bindings": [{
        "context": "Chat",
        "bindings": {
            "enter": "insert_newline",
            "ctrl+enter": "chat:submit"
        }
    }]
}
```

**Resolution Process:**
```
1. Default bindings loaded:
   - Chat.enter → "chat:submit"

2. User bindings appended:
   - Chat.enter → "insert_newline"

3. Flattened array (simplified):
   [
     { context: "Chat", chord: [{key:"enter"}], action: "chat:submit" },
     { context: "Chat", chord: [{key:"enter"}], action: "insert_newline" }
   ]

4. User presses Enter:
   - resolveKeystroke finds both matches
   - Last match wins: "insert_newline"
```

**Result:** `enter` inserts newline; `ctrl+enter` submits (user's new binding).

---

### 3.2 Chord vs Single Key Conflict

**Scenario:** `ctrl+k` is bound both as a single-key action and as the start of a chord.

**Configuration:**
```json
{
    "context": "Chat",
    "bindings": {
        "ctrl+k": "kill_line",
        "ctrl+k ctrl+c": "clear_history"
    }
}
```

**Resolution Process:**

```javascript
// ============================================
// Chord priority over single key
// ============================================

// When user presses Ctrl+K:
resolveKeystroke("k", {ctrl:true}, ["Chat"], bindings, null)
    ↓
// Step 5: Check for PREFIX match
bindings.some(b =>
    b.chord.length > 1 && isPrefixMatch([{key:"k",ctrl:true}], b)
)
// Found: "ctrl+k ctrl+c" has length 2 > 1, and matches prefix
    ↓
return { type: "chord_started", pending: [{key:"k",ctrl:true}] }
    ↓
// 1000ms timer started
// User has 1 second to press Ctrl+C

// If user presses Ctrl+C within timeout:
resolveKeystroke("c", {ctrl:true}, ["Chat"], bindings, [{key:"k",ctrl:true}])
    ↓
// Build sequence: [ctrl+k, ctrl+c]
// Find exact match: "clear_history"
    ↓
return { type: "match", action: "clear_history" }

// If user waits > 1000ms:
// Timer fires → chord cancelled
// User must re-press Ctrl+K
// After timeout, pressing Ctrl+K alone triggers "kill_line"
```

**Why chord takes priority:**
- Prefix detection happens before exact match checking
- Chords are more specific than single keys
- Users can still trigger single-key by waiting for timeout

---

### 3.3 Cross-Context Conflict

**Scenario:** Same keystroke bound in multiple active contexts.

**Configuration:**
```json
[
    {
        "context": "Global",
        "bindings": {
            "ctrl+c": "app:interrupt"
        }
    },
    {
        "context": "Transcript",
        "bindings": {
            "ctrl+c": "transcript:exit"
        }
    }
]
```

**Resolution Process:**
```
User in Transcript view:
  activeContexts: ["Transcript", "Global"]

Filter bindings by context:
  Both "Transcript" and "Global" bindings match

Exact match loop:
  1. Check Global binding: ctrl+c → "app:interrupt" ✓
  2. Check Transcript binding: ctrl+c → "transcript:exit" ✓

Last-match-wins:
  If Transcript binding appears later in array: "transcript:exit" wins
```

**Result:** Context-specific bindings shadow global bindings when both are active.

---

### 3.4 Null Binding (Explicit Unbind)

**Scenario:** User wants to disable a default shortcut.

**Configuration:**
```json
{
    "context": "Chat",
    "bindings": {
        "ctrl+l": null
    }
}
```

**Resolution Process:**
```javascript
// Flatten creates binding with null action:
{ context: "Chat", chord: [{key:"l",ctrl:true}], action: null }

// When user presses Ctrl+L:
resolveKeystroke(...)
    ↓
// Exact match found
matchedBinding = { action: null }
    ↓
if (matchedBinding.action === null) {
    return { type: "unbound" };
}
```

**Result:** The keystroke is consumed but no action executes. This prevents the keystroke from falling through to the terminal or application.

---

## 4. System Reserved Shortcuts

### 4.1 Non-Overridable Shortcuts

Some shortcuts cannot be overridden because they are handled at the OS or terminal level:

**macOS Reserved (lN8):**
```javascript
// ============================================
// lN8 - RESERVED_MACOS_SHORTCUTS
// Location: chunks.89.mjs:2853-2880
// ============================================

const RESERVED_MACOS_SHORTCUTS = [
    { key: "cmd+c", reason: "macOS system copy", severity: "error" },
    { key: "cmd+v", reason: "macOS system paste", severity: "error" },
    { key: "cmd+x", reason: "macOS system cut", severity: "error" },
    { key: "cmd+q", reason: "macOS quit application", severity: "error" },
    { key: "cmd+w", reason: "macOS close window/tab", severity: "error" },
    { key: "cmd+tab", reason: "macOS app switcher", severity: "error" },
    { key: "cmd+space", reason: "macOS Spotlight", severity: "error" }
];
```

**Unix Reserved (cN8):**
```javascript
// ============================================
// cN8 - RESERVED_UNIX_SHORTCUTS
// Location: chunks.89.mjs:2845-2852
// ============================================

const RESERVED_UNIX_SHORTCUTS = [
    { key: "ctrl+z", reason: "Unix process suspend (SIGTSTP)", severity: "warning" },
    { key: "ctrl+\\", reason: "Terminal quit signal (SIGQUIT)", severity: "error" }
];
```

**Hardcoded Reserved (wp6):**
```javascript
// ============================================
// wp6 - RESERVED_HARDCODED_SHORTCUTS
// Location: chunks.89.mjs:2833-2844
// ============================================

const RESERVED_HARDCODED_SHORTCUTS = [
    { key: "ctrl+d", reason: "Cannot be rebound - used for exit (hardcoded)", severity: "error" },
    { key: "ctrl+m", reason: "Cannot be rebound - identical to Enter in terminals (both send CR)", severity: "error" }
];
```

**Why Ctrl+M cannot be bound:**
- In legacy terminal mode, Ctrl+M and Enter both send ASCII code 13 (CR)
- Terminals cannot distinguish them without CSI u protocol
- Claude Code doesn't enable CSI u mode for compatibility reasons

---

### 4.2 Validation Warning System

When users attempt to bind reserved shortcuts, the validation system generates warnings:

```javascript
// ============================================
// Qu9 - detectReservedKeyConflicts
// Location: chunks.89.mjs:3054-3100
// ============================================

// ORIGINAL (for source lookup):
function Qu9(A, q) {
    let K = [];
    for (let Y of A) {
        let z = L34(Y.key, q);
        if (z) K.push({
            type: "reserved",
            severity: z.severity,
            message: `Cannot bind "${Y.key}" in ${Y.context} context - ${z.reason}`,
            key: Y.key,
            context: Y.context,
            reason: z.reason,
            suggestion: "Choose a different key combination"
        })
    }
    return K
}

// READABLE (for understanding):
function detectReservedKeyConflicts(bindings, platform) {
    let warnings = [];

    for (let binding of bindings) {
        let reservedCheck = getReservedShortcutInfo(binding.key, platform);

        if (reservedCheck) {
            warnings.push({
                type: "reserved",
                severity: reservedCheck.severity, // "error" or "warning"
                message: `Cannot bind "${binding.key}" in ${binding.context} context - ${reservedCheck.reason}`,
                key: binding.key,
                context: binding.context,
                reason: reservedCheck.reason,
                suggestion: "Choose a different key combination"
            });
        }
    }

    return warnings;
}

// Mapping: Qu9→detectReservedKeyConflicts, A→bindings, q→platform, K→warnings, Y→binding, z→reservedCheck, L34→getReservedShortcutInfo
```

---

## 5. Duplicate Detection

### 5.1 JSON-Level Duplicates

The validation system detects when the same key appears twice in one context block:

```javascript
// ============================================
// pu9 - detectDuplicateBindings (JSON source level)
// Location: chunks.89.mjs:3030-3052
// ============================================

// Detects duplicates by parsing JSON source with regex
// Example JSON with duplicate:
{
    "context": "Chat",
    "bindings": {
        "ctrl+s": "save_draft",
        "ctrl+s": "save_all"    // WARNING: Duplicate!
    }
}

// JSON spec: Last value wins, earlier values are ignored
// Warning informs user about potential mistake
```

### 5.2 Cross-Block Duplicates

The system also detects when the same key is bound in multiple context blocks:

```json
[
    {
        "context": "Chat",
        "bindings": {
            "ctrl+s": "save_draft"
        }
    },
    {
        "context": "Chat",
        "bindings": {
            "ctrl+s": "save_all"    // INFO: Overrides previous
        }
    }
]
```

**Resolution:** Last block wins. This is valid and often intentional.

---

## 6. Platform-Specific Resolution

### 6.1 Modifier Key Equivalence

The matching system treats certain modifiers as equivalent:

```javascript
// ============================================
// W$1 - keystrokesMatch with alt/meta equivalence
// Location: chunks.65.mjs:732-734
// ============================================

function keystrokesMatch(keystrokeA, keystrokeB) {
    return keystrokeA.key === keystrokeB.key &&
           keystrokeA.ctrl === keystrokeB.ctrl &&
           keystrokeA.shift === keystrokeB.shift &&
           // KEY INSIGHT: alt and meta are treated as equivalent!
           (keystrokeA.alt || keystrokeA.meta) === (keystrokeB.alt || keystrokeB.meta) &&
           keystrokeA.super === keystrokeB.super;
}
```

**Why this matters:**
- On macOS, Option key sends `alt`
- On some terminals, Option sends `meta`
- This equivalence ensures cross-platform consistency

### 6.2 Platform-Specific Key Variables

```javascript
// ============================================
// Platform-specific key definitions
// Location: chunks.89.mjs:2614
// ============================================

// ORIGINAL (for source lookup):
Cu9 = y8() === "windows" ? "alt+v" : "ctrl+v",
Iu9 = y8() !== "windows" || (A$6() ? Z$8(process.versions.bun, ">=1.2.23") : Z$8(process.versions.node, ">=22.17.0 <23.0.0 || >=24.2.0")),
bu9 = Iu9 ? "shift+tab" : "meta+m"

// READABLE (for understanding):
imagePasteKey = getPlatform() === "windows" ? "alt+v" : "ctrl+v";
supportsShiftTab = getPlatform() !== "windows" ||
    (isBun() ? semverSatisfies(bunVersion, ">=1.2.23") :
              semverSatisfies(nodeVersion, ">=22.17.0 <23.0.0 || >=24.2.0"));
modeCycleKey = supportsShiftTab ? "shift+tab" : "meta+m";

// Mapping: Cu9→imagePasteKey, Iu9→supportsShiftTab, bu9→modeCycleKey, y8→getPlatform, A$6→isBun, Z$8→semverSatisfies
```

---

## 7. Conflict Resolution Decision Tree

```
Keystroke arrives
       │
       ▼
Is Escape pressed AND chord pending?
       ├─ YES → Return "chord_cancelled"
       └─ NO  → Continue
             │
             ▼
       Can normalize to valid keystroke?
             ├─ NO  → Chord pending? → YES → Return "chord_cancelled"
             │                       → NO  → Return "none"
             └─ YES → Build sequence (append to pending or new)
                   │
                   ▼
             Filter bindings by active contexts
                   │
                   ▼
             Any binding is PREFIX of sequence?
                   ├─ YES → Return "chord_started", start 1000ms timer
                   └─ NO  → Continue
                         │
                         ▼
                   Find EXACT matches (iterate all)
                         │
                         ▼
                   Found match?
                   ├─ YES → Action is null? → YES → Return "unbound"
                   │                      → NO  → Return "match" (LAST match wins)
                   └─ NO  → Chord was pending? → YES → Return "chord_cancelled"
                                               → NO  → Return "none"
```

---

## 8. Summary

**Conflict Resolution Principles:**

| Principle | Implementation |
|-----------|----------------|
| User overrides defaults | User bindings appended last, last-match-wins |
| Chord priority | Prefix check before exact match |
| Context shadowing | Specific contexts override Global |
| Explicit unbind | Null action returns "unbound" type |
| System shortcuts | Cannot override, validation warns |
| Platform adaptation | Modifier equivalence, platform-specific keys |

**Key Algorithms:**
1. **Merge**: `[...defaults, ...user]` - array order determines priority
2. **Resolve**: 7-step matching with prefix/exact distinction
3. **Last-match-wins**: For loop overwrites, doesn't break
4. **Validation**: Multi-layer checking for errors and warnings

**Last Updated**: 2026-03-23 (Claude Code v2.1.76)