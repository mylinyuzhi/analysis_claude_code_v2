# Sandbox UI Interaction Flows (Claude Code 2.1.76)

## Overview

This document provides detailed analysis of the sandbox UI interaction patterns, state machines, and user flows. It covers the complete lifecycle of user interactions with sandbox settings through the `/sandbox` command and related UI components.

---

## Symbol Reference

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Sandbox section
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI components

Key functions in this document:
- `sandboxSlashCommandDefinition` (bAz) - chunks.165.mjs:2007 - Slash command entry point
- `SandboxModeSelector` (TPq) - chunks.165.mjs - Interactive mode picker
- `SandboxViolationStore` (HD6) - chunks.55.mjs:2902 - State management
- `sandboxConfigObject` (vA) - chunks.56.mjs:516 - Settings API

---

## 1. /sandbox Command State Machine

### Entry Point: Description Getter

The `/sandbox` command's description is computed dynamically on every render:

```javascript
// ============================================
// sandboxSlashCommandDefinition - Dynamic description with live state
// Location: chunks.165.mjs:2007-2032
// ============================================

// ORIGINAL (for source lookup):
bAz = {
    name: "sandbox",
    get description() {
        let A = vA.isSandboxingEnabled(),
            q = vA.isAutoAllowBashIfSandboxedEnabled(),
            K = vA.areUnsandboxedCommandsAllowed(),
            Y = vA.areSandboxSettingsLockedByPolicy(),
            z = vA.checkDependencies().errors.length === 0,
            _;
        if (!z) _ = a6.warning;
        else _ = A ? a6.tick : a6.circle;
        let w = "sandbox disabled";
        if (A) w = q ? "sandbox enabled (auto-allow)" : "sandbox enabled",
            w += K ? ", fallback allowed" : "";
        if (Y) w += " (managed)";
        return `${_} ${w} (⏎ to configure)`
    },
    // ... rest of definition
}

// READABLE (for understanding):
sandboxSlashCommandDefinition = {
    name: "sandbox",

    // Description is a getter - computed fresh every time the slash command list renders
    get description() {
        let sandboxEnabled = sandboxConfigObject.isSandboxingEnabled();
        let autoAllow = sandboxConfigObject.isAutoAllowBashIfSandboxedEnabled();
        let fallbackAllowed = sandboxConfigObject.areUnsandboxedCommandsAllowed();
        let isManaged = sandboxConfigObject.areSandboxSettingsLockedByPolicy();
        let depsOk = sandboxConfigObject.checkDependencies().errors.length === 0;

        // Icon determination (3-way)
        let icon;
        if (!depsOk) {
            icon = "⚠";  // Warning: missing dependencies
        } else if (sandboxEnabled) {
            icon = "✓";  // Checkmark: enabled
        } else {
            icon = "○";  // Circle: disabled
        }

        // Status text construction
        let statusText = "sandbox disabled";
        if (sandboxEnabled) {
            statusText = autoAllow ? "sandbox enabled (auto-allow)" : "sandbox enabled";
            statusText += fallbackAllowed ? ", fallback allowed" : "";
        }
        if (isManaged) {
            statusText += " (managed)";  // Locked by policy
        }

        return `${icon} ${statusText} (⏎ to configure)`;
    },

    argumentHint: 'exclude "command pattern"',
    isEnabled: () => true,

    // Hidden on unsupported platforms or when disabled via enabledPlatforms
    get isHidden() {
        return !sandboxConfigObject.isSupportedPlatform() ||
               !sandboxConfigObject.isPlatformInEnabledList();
    },

    immediate: true,  // Renders inline without extra Enter
    type: "local-jsx",
    userFacingName: () => "sandbox",
    load: () => Promise.resolve().then(() => sandboxUIComponent)
}

// Mapping: bAz→sandboxSlashCommandDefinition, vA→sandboxConfigObject, a6→iconSet
```

### State Machine Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     /sandbox Command State Transitions                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Initial State Check (on each slash command list render)                    │
│       │                                                                      │
│       ├─ Platform Check: isSupportedPlatform()?                             │
│       │       └─ false → Command hidden                                      │
│       │       └─ true → Continue                                             │
│       │                                                                      │
│       ├─ Enabled Platforms: isPlatformInEnabledList()?                       │
│       │       └─ false → Command hidden                                      │
│       │       └─ true → Continue                                             │
│       │                                                                      │
│       └─ Description Generation:                                             │
│               ├─ checkDependencies() → errors? → ⚠ icon                     │
│               ├─ isSandboxingEnabled()? → true → ✓ icon                      │
│               └─ else → ○ icon                                               │
│                                                                              │
│  User Triggers /sandbox                                                      │
│       │                                                                      │
│       ├─ isSupportedPlatform()? → false → Error message                     │
│       ├─ isPlatformInEnabledList()? → false → Error message                  │
│       ├─ areSandboxSettingsLockedByPolicy()? → true → Error message          │
│       │                                                                      │
│       └─ All checks pass → Load SandboxModeSelector component                │
│                                                                              │
│  SandboxModeSelector Component                                               │
│       │                                                                      │
│       ├─ No args → Show interactive UI                                      │
│       │       ├─ Tab 1: Mode selector (auto-allow / regular / disabled)     │
│       │       ├─ Tab 2: Overrides (open/closed policy)                      │
│       │       ├─ Tab 3: Status (current config summary)                     │
│       │       └─ Tab 4: Dependencies (if warnings)                          │
│       │                                                                      │
│       └─ "exclude <pattern>" → Add to excludedCommands                      │
│                                                                              │
│  State Change Applied                                                        │
│       │                                                                      │
│       └─ setSandboxSettings() → Write to localSettings.json                 │
│               → Settings change event → UI re-renders                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. SandboxModeSelector Interaction Flow

### Component Architecture

```javascript
// ============================================
// SandboxModeSelector - Interactive 3-way mode picker
// Location: chunks.165.mjs (inferred from context)
// ============================================

// READABLE (for understanding):
function SandboxModeSelector({ onComplete, depCheck }) {
    // Theme hook for colorization
    let [theme] = useTheme();

    // Live state from sandbox API
    let sandboxEnabled = sandboxConfigObject.isSandboxingEnabled();
    let autoAllow = sandboxConfigObject.isAutoAllowBashIfSandboxedEnabled();
    let hasWarnings = depCheck.warnings.length > 0;

    // Get additional settings
    let settings = getSettings();
    let allowAllUnixSockets = settings.sandbox?.network?.allowAllUnixSockets;
    let showUnixSocketWarning = hasWarnings && !allowAllUnixSockets;

    // Determine current mode (derived state)
    let currentMode = !sandboxEnabled ? "disabled"
                    : autoAllow ? "auto-allow"
                    : "regular";

    let currentLabel = colorize("success", theme)("(current)");

    // Build options array with current marker
    let options = [
        {
            label: currentMode === "auto-allow"
                ? `Sandbox BashTool, with auto-allow ${currentLabel}`
                : "Sandbox BashTool, with auto-allow",
            value: "auto-allow"
        },
        {
            label: currentMode === "regular"
                ? `Sandbox BashTool, with regular permissions ${currentLabel}`
                : "Sandbox BashTool, with regular permissions",
            value: "regular"
        },
        {
            label: currentMode === "disabled"
                ? `No Sandbox ${currentLabel}`
                : "No Sandbox",
            value: "disabled"
        }
    ];

    // Handle selection change
    async function handleChange(selection) {
        switch (selection) {
            case "auto-allow":
                await sandboxConfigObject.setSandboxSettings({
                    enabled: true,
                    autoAllowBashIfSandboxed: true
                });
                onComplete("✓ Sandbox enabled with auto-allow for bash commands");
                break;

            case "regular":
                await sandboxConfigObject.setSandboxSettings({
                    enabled: true,
                    autoAllowBashIfSandboxed: false
                });
                onComplete("✓ Sandbox enabled with regular bash permissions");
                break;

            case "disabled":
                await sandboxConfigObject.setSandboxSettings({
                    enabled: false,
                    autoAllowBashIfSandboxed: false
                });
                onComplete("○ Sandbox disabled");
                break;
        }
    }

    // Render with tabs
    return (
        <TabPanel title="Sandbox:">
            {/* Tab content */}
        </TabPanel>
    );
}

// Mapping: vA→sandboxConfigObject, TPq→SandboxModeSelector
```

### Mode Selection State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Mode Selection State Machine                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Current State (read from vA)                                               │
│       │                                                                      │
│       ├─ isSandboxingEnabled() = false → State = "disabled"                 │
│       ├─ isAutoAllowBashIfSandboxedEnabled() = true → State = "auto-allow"  │
│       └─ else → State = "regular"                                           │
│                                                                              │
│  User Selects New Mode                                                       │
│       │                                                                      │
│       ├─ "auto-allow" → setSandboxSettings({enabled: true, autoAllow: true})│
│       ├─ "regular" → setSandboxSettings({enabled: true, autoAllow: false})  │
│       └─ "disabled" → setSandboxSettings({enabled: false, autoAllow: false})│
│                                                                              │
│  setSandboxSettings Implementation (Mx3)                                    │
│       │                                                                      │
│       ├─ Read current localSettings                                         │
│       ├─ Merge new sandbox settings                                         │
│       ├─ Write to .claude/settings.local.json                              │
│       └─ Settings change event fires                                        │
│                                                                              │
│  State Propagation                                                           │
│       │                                                                      │
│       ├─ Settings store updates                                             │
│       ├─ vA methods reflect new state                                       │
│       ├─ Slash command description re-computes                              │
│       └─ onComplete callback renders success message                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. SandboxViolationStore Observer Pattern

### Class Implementation

```javascript
// ============================================
// SandboxViolationStore - Ring buffer with observer pattern
// Location: chunks.55.mjs:2902-2936
// ============================================

// ORIGINAL (for source lookup):
class HD6 {
    constructor() {
        this.violations = [], this.totalCount = 0, this.maxSize = 100, this.listeners = new Set
    }
    addViolation(A) {
        if (this.violations.push(A), this.totalCount++, this.violations.length > this.maxSize)
            this.violations = this.violations.slice(-this.maxSize);
        this.notifyListeners()
    }
    getViolations(A) {
        if (A === void 0) return [...this.violations];
        return this.violations.slice(-A)
    }
    getCount() {
        return this.violations.length
    }
    getTotalCount() {
        return this.totalCount
    }
    getViolationsForCommand(A) {
        let q = T21(A);
        return this.violations.filter((K) => K.encodedCommand === q)
    }
    clear() {
        this.violations = [], this.notifyListeners()
    }
    subscribe(A) {
        return this.listeners.add(A), A(this.getViolations()), () => {
            this.listeners.delete(A)
        }
    }
    notifyListeners() {
        let A = this.getViolations();
        this.listeners.forEach((q) => q(A))
    }
}

// READABLE (for understanding):
class SandboxViolationStore {
    constructor() {
        this.violations = [];      // Ring buffer - last 100 violations
        this.totalCount = 0;       // Cumulative count - never reset
        this.maxSize = 100;        // Buffer limit
        this.listeners = new Set(); // Observer callbacks
    }

    /**
     * Add a violation event.
     * Auto-trims buffer when exceeding maxSize.
     * Notifies all subscribers.
     */
    addViolation(violation) {
        this.violations.push(violation);
        this.totalCount++;

        // Ring buffer: keep only last maxSize entries
        if (this.violations.length > this.maxSize) {
            this.violations = this.violations.slice(-this.maxSize);
        }

        this.notifyListeners();
    }

    /**
     * Get violations. Returns copy to prevent mutation.
     * @param count - Optional, returns last N violations
     */
    getViolations(count) {
        if (count === undefined) {
            return [...this.violations];  // Full copy
        }
        return this.violations.slice(-count);
    }

    /**
     * Current buffer size (may be less than totalCount).
     */
    getCount() {
        return this.violations.length;
    }

    /**
     * Lifetime total - useful for delta calculation.
     */
    getTotalCount() {
        return this.totalCount;
    }

    /**
     * Get violations for a specific command.
     * Uses base64-encoded command for matching.
     */
    getViolationsForCommand(command) {
        let encoded = encodeBase64Command(command);
        return this.violations.filter(v => v.encodedCommand === encoded);
    }

    /**
     * Clear buffer (keep totalCount for delta tracking).
     */
    clear() {
        this.violations = [];
        this.notifyListeners();
    }

    /**
     * Subscribe to violation updates.
     * Returns unsubscribe function for React useEffect cleanup.
     */
    subscribe(callback) {
        this.listeners.add(callback);
        callback(this.getViolations());  // Immediate callback with current state
        return () => {
            this.listeners.delete(callback);
        };
    }

    /**
     * Notify all subscribers of state change.
     */
    notifyListeners() {
        let violations = this.getViolations();
        this.listeners.forEach(callback => callback(violations));
    }
}

// Mapping: HD6→SandboxViolationStore, T21→encodeBase64Command
```

### Observer Pattern Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SandboxViolationStore Observer Pattern                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Violation Detection (macOS only)                                           │
│       │                                                                      │
│       └─ log stream monitors sandbox-exec deny messages                    │
│              │                                                               │
│              └─ startLogMonitor (UZ7) parses log lines                     │
│                     │                                                        │
│                     └─ Matches CMD64_<base64>_END tag                      │
│                            │                                                 │
│                            └─ addViolation({line, command, timestamp})     │
│                                   │                                          │
│                                   ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    SandboxViolationStore (HD6)                       │   │
│  │                                                                       │   │
│  │  violations = [...recent 100...]                                     │   │
│  │  totalCount = N (cumulative)                                         │   │
│  │  listeners = Set([callback1, callback2, ...])                        │   │
│  │                                                                       │   │
│  │  addViolation() → push, trim, notifyListeners()                      │   │
│  │                                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                   │                                          │
│                                   ▼                                          │
│  notifyListeners()                                                          │
│       │                                                                      │
│       ├─► SandboxViolationStatusLine (aIq)                                 │
│       │       └─ Computes delta: currentTotal - lastKnownTotal             │
│       │       └─ If delta > 0: shows "⧈ Sandbox blocked N operations"     │
│       │       └─ Auto-dismisses after 5 seconds                            │
│       │                                                                      │
│       ├─► Bash Command Output Annotation                                   │
│       │       └─ annotateStderrWithSandboxFailures (eb3)                   │
│       │       └─ Appends <sandbox_violations> block to stderr              │
│       │                                                                      │
│       └─► Other subscribers (future expansion)                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. SandboxViolationStatusLine Component

### Implementation

```javascript
// ============================================
// SandboxViolationStatusLine - Status bar flash on new violations
// Location: chunks.191.mjs:92-127 (inferred)
// ============================================

// ORIGINAL (for source lookup):
function aIq() {
    let A = A6(6), [q, K] = RV6.useState(0), Y = RV6.useRef(null),
        z = Rq("app:toggleTranscript", "Global", "ctrl+o");
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) _ = () => {
        if (!vA.isSandboxingEnabled()) return;
        let H = vA.getSandboxViolationStore(), j = H.getTotalCount(),
            J = H.subscribe(() => {
                let M = H.getTotalCount(), D = M - j;
                if (D > 0) {
                    K(D); j = M;
                    if (Y.current) clearTimeout(Y.current);
                    Y.current = setTimeout(() => K(0), 5000);
                }
            });
        return () => { J(); if (Y.current) clearTimeout(Y.current) }
    }
    if (RV6.useEffect(_, w), !vA.isSandboxingEnabled() || q === 0) return null;
    return "⧈ Sandbox blocked {q} {operations} · ctrl+o for details · /sandbox to disable"
}

// READABLE (for understanding):
function SandboxViolationStatusLine() {
    let [newViolationCount, setNewViolationCount] = useState(0);
    let timeoutRef = useRef(null);

    // Get keyboard shortcut for transcript toggle
    let toggleShortcut = getKeybinding("app:toggleTranscript", "Global", "ctrl+o");

    useEffect(() => {
        // Gate: Don't subscribe if sandbox disabled
        if (!sandboxConfigObject.isSandboxingEnabled()) {
            return;
        }

        let store = sandboxConfigObject.getSandboxViolationStore();
        let lastKnownTotal = store.getTotalCount();

        // Subscribe to violation updates
        let unsubscribe = store.subscribe(() => {
            let currentTotal = store.getTotalCount();
            let delta = currentTotal - lastKnownTotal;

            if (delta > 0) {
                // New violations detected!
                setNewViolationCount(delta);
                lastKnownTotal = currentTotal;

                // Auto-dismiss after 5 seconds
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                timeoutRef.current = setTimeout(() => {
                    setNewViolationCount(0);
                }, 5000);
            }
        });

        // Cleanup on unmount
        return () => {
            unsubscribe();
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Render: Only show when there are new violations
    if (!sandboxConfigObject.isSandboxingEnabled() || newViolationCount === 0) {
        return null;
    }

    // Dynamic text based on count
    let operationWord = newViolationCount === 1 ? "operation" : "operations";

    return (
        <Text>
            ⧈ Sandbox blocked {newViolationCount} {operationWord} ·
            {toggleShortcut} for details · /sandbox to disable
        </Text>
    );
}

// Mapping: aIq→SandboxViolationStatusLine, vA→sandboxConfigObject, Rq→getKeybinding
```

### Status Line Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 SandboxViolationStatusLine Lifecycle                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Component Mount                                                             │
│       │                                                                      │
│       ├─ isSandboxingEnabled()? → false → return null                       │
│       └─ true → Subscribe to SandboxViolationStore                          │
│                                                                              │
│  Subscription Active                                                         │
│       │                                                                      │
│       └─ store.subscribe(callback)                                          │
│              │                                                               │
│              └─ callback receives violations array on every change          │
│                     │                                                        │
│                     ├─ Calculate delta: currentTotal - lastKnownTotal       │
│                     │                                                        │
│                     └─ if delta > 0:                                        │
│                            ├─ setNewViolationCount(delta)                   │
│                            └─ setTimeout(5000) → setNewViolationCount(0)    │
│                                                                              │
│  Render States                                                               │
│       │                                                                      │
│       ├─ newViolationCount === 0 → return null (hidden)                     │
│       │                                                                      │
│       └─ newViolationCount > 0 → Show status line                           │
│              "⧈ Sandbox blocked N operations · ctrl+o for details"          │
│                                                                              │
│  Auto-Dismiss                                                                │
│       │                                                                      │
│       └─ After 5 seconds → setNewViolationCount(0) → re-render → null       │
│                                                                              │
│  Component Unmount                                                           │
│       │                                                                      │
│       └─ Cleanup: unsubscribe(), clearTimeout()                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Permission Prompt Integration

### "Bash command (unsandboxed)" Title

When a Bash tool call triggers a permission prompt, the title reflects sandbox status:

```javascript
// ============================================
// BashPermissionPrompt - Sandbox-aware title
// Location: chunks.189.mjs (inferred from context)
// ============================================

// ORIGINAL (for source lookup):
let J6 = vA.isSandboxingEnabled(), K6 = Ti(A.input);
// ...
title: J6 && !K6 ? "Bash command (unsandboxed)" : "Bash command"

// READABLE (for understanding):
let isSandboxActive = sandboxConfigObject.isSandboxingEnabled();
let willRunSandboxed = isCommandSandboxed(input);

// Title logic:
let title;
if (isSandboxActive && !willRunSandboxed) {
    // Warning: Sandbox is enabled but this command will NOT be sandboxed
    title = "Bash command (unsandboxed)";
} else {
    // Normal: Either sandbox is off, or command will be sandboxed
    title = "Bash command";
}
```

### Decision Logic Table

| isSandboxActive | willRunSandboxed | Title |
|-----------------|------------------|-------|
| false | false | "Bash command" |
| false | true | "Bash command" (impossible - sandbox off) |
| true | false | "Bash command (unsandboxed)" ⚠️ |
| true | true | "Bash command" |

### When "unsandboxed" Appears

The `willRunSandboxed = false` when:
1. `dangerouslyDisableSandbox: true` AND `allowUnsandboxedCommands: true`
2. Command matches `excludedCommands` pattern
3. Command is empty

---

## 6. Settings Persistence Flow

### setSandboxSettings Implementation

```javascript
// ============================================
// setSandboxSettings - Persist sandbox settings to local config
// Location: chunks.56.mjs:395-411
// ============================================

// ORIGINAL (for source lookup):
async function Mx3(A) {
    let q = L8("localSettings");
    TA("localSettings", {
        sandbox: {
            ...q?.sandbox,
            ...A.enabled !== void 0 && {
                enabled: A.enabled
            },
            ...A.autoAllowBashIfSandboxed !== void 0 && {
                autoAllowBashIfSandboxed: A.autoAllowBashIfSandboxed
            },
            ...A.allowUnsandboxedCommands !== void 0 && {
                allowUnsandboxedCommands: A.allowUnsandboxedCommands
            }
        }
    })
}

// READABLE (for understanding):
async function setSandboxSettings(newSettings) {
    // Read current local settings
    let currentLocal = getSettingsLayer("localSettings");

    // Merge sandbox settings (only update provided fields)
    updateSettingsLayer("localSettings", {
        sandbox: {
            ...currentLocal?.sandbox,
            // Conditional spread - only include if explicitly provided
            ...(newSettings.enabled !== undefined && {
                enabled: newSettings.enabled
            }),
            ...(newSettings.autoAllowBashIfSandboxed !== undefined && {
                autoAllowBashIfSandboxed: newSettings.autoAllowBashIfSandboxed
            }),
            ...(newSettings.allowUnsandboxedCommands !== undefined && {
                allowUnsandboxedCommands: newSettings.allowUnsandboxedCommands
            })
        }
    });

    // This triggers a settings change event
    // → Subscribers are notified
    // → vA methods reflect new state
    // → UI re-renders
}

// Mapping: Mx3→setSandboxSettings, L8→getSettingsLayer, TA→updateSettingsLayer
```

### Persistence Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Settings Persistence Flow                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User Action (UI)                                                           │
│       │                                                                      │
│       └─ SandboxModeSelector.handleChange("auto-allow")                     │
│              │                                                               │
│              └─ sandboxConfigObject.setSandboxSettings({...})               │
│                     │                                                        │
│                     ▼                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    setSandboxSettings (Mx3)                          │   │
│  │                                                                       │   │
│  │  1. Read current localSettings                                       │   │
│  │  2. Merge new sandbox settings                                       │   │
│  │  3. Write to .claude/settings.local.json                            │   │
│  │                                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                     │                                                        │
│                     ▼                                                        │
│  Settings Change Event                                                      │
│       │                                                                      │
│       ├─ Settings store updates                                             │
│       │                                                                      │
│       └─ Subscribers notified                                               │
│              │                                                               │
│              ├─ sandboxConfigObject.refreshConfig() (Wx3)                  │
│              │      └─ aO.updateConfig(newConfig)                          │
│              │                                                              │
│              ├─ Slash command description re-computes                       │
│              │                                                              │
│              └─ UI components re-render with new state                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Dependency Check Integration

### checkDependencies Implementation

```javascript
// ============================================
// checkDependencies - Verify sandbox prerequisites
// Location: chunks.55.mjs:3069-3088
// ============================================

// ORIGINAL (for source lookup):
function oZ7(A) {
    if (!rZ7()) return {
        errors: ["Unsupported platform"],
        warnings: []
    };
    let q = [],
        K = [],
        Y = A ?? R5?.ripgrep ?? {
            command: "rg"
        };
    if (JU(Y.command) === null) q.push(`ripgrep (${Y.command}) not found`);
    if ($v() === "linux") {
        let _ = bZ7(R5?.seccomp);
        q.push(..._.errors), K.push(..._.warnings)
    }
    return {
        errors: q,
        warnings: K
    }
}

// READABLE (for understanding):
function checkDependencies(ripgrepConfig) {
    // Gate: Check platform support
    if (!isSupportedPlatform()) {
        return {
            errors: ["Unsupported platform"],
            warnings: []
        };
    }

    let errors = [];
    let warnings = [];

    // Check ripgrep
    let rgConfig = ripgrepConfig ?? currentConfig?.ripgrep ?? { command: "rg" };
    if (which(rgConfig.command) === null) {
        errors.push(`ripgrep (${rgConfig.command}) not found`);
    }

    // Linux-specific checks
    if (getPlatform() === "linux") {
        let seccompCheck = checkSeccompBinaries(currentConfig?.seccomp);
        errors.push(...seccompCheck.errors);
        warnings.push(...seccompCheck.warnings);
    }

    return { errors, warnings };
}

// Mapping: oZ7→checkDependencies, rZ7→isSupportedPlatform, JU→which, $v→getPlatform
```

### Error vs Warning Classification

| Check | Type | Message |
|-------|------|---------|
| Unsupported platform | Error | "Unsupported platform" |
| ripgrep not found | Error | "ripgrep (rg) not found" |
| bwrap not found (Linux) | Error | "bwrap not found" |
| socat not found (Linux) | Error | "socat not found" |
| seccomp binaries missing (Linux) | Warning | "Unix socket blocking unavailable" |

---

## 8. Permission Prompt Flow with Sandbox Context

### Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Permission Prompt Sandbox Context Flow                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Bash Tool Call Received                                                    │
│       │                                                                      │
│       └─ Agent loop prepares permission check                               │
│              │                                                               │
│              └─ BashPermissionPrompt component renders                      │
│                     │                                                        │
│                     ├─ useMemo: Compute sandboxingEnabled (J6)              │
│                     │       └─ vA.isSandboxingEnabled()                     │
│                     │                                                        │
│                     ├─ useMemo: Compute isSandboxed (K6)                    │
│                     │       └─ sandboxingEnabled && Ti(input)               │
│                     │              └─ isCommandSandboxed(input)             │
│                     │                                                        │
│                     └─ Title Selection:                                      │
│                            ├─ J6 && !K6 → "Bash command (unsandboxed)"      │
│                            └─ else → "Bash command"                         │
│                                                                              │
│  Permission Decision                                                         │
│       │                                                                      │
│       ├─ Auto-allow path (if sandbox + autoAllowBashIfSandboxed):           │
│       │       └─ Check: isSandboxingEnabled() && isAutoAllow() && Ti()      │
│       │              → behavior: "allow" without prompt                     │
│       │                                                                      │
│       └─ Normal permission flow:                                             │
│              └─ Prompt shows with sandbox-aware title                        │
│                     ├─ User allows → Command runs                           │
│                     └─ User denies → Command blocked                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Source Code: Permission Prompt Title Logic

**Location:** chunks.189.mjs:273-283

```javascript
// ============================================
// BashPermissionPrompt - Sandbox context computation
// Location: chunks.189.mjs:273-283
// ============================================

// ORIGINAL (for source lookup):
let {
    destructiveWarning: H6,
    sandboxingEnabled: J6,
    isSandboxed: K6
} = Xw.useMemo(() => {
    let l = w8("tengu_destructive_command_warning", !1) ? _Cq(w) : null,
        q6 = vA.isSandboxingEnabled(),
        w6 = q6 && Ti(A.input);
    return {
        destructiveWarning: l,
        sandboxingEnabled: q6,
        isSandboxed: w6
    }
}, [w, A.input])

// ... later in render:
title: J6 && !K6 ? "Bash command (unsandboxed)" : "Bash command"

// READABLE (for understanding):
let {
    destructiveWarning,
    sandboxingEnabled,
    isSandboxed
} = useMemo(() => {
    // Check for destructive command warning (separate from sandbox)
    let destWarning = getFeatureFlag("tengu_destructive_command_warning", false)
        ? analyzeDestructiveCommand(command)
        : null;

    // Sandbox context
    let sandboxActive = sandboxConfigObject.isSandboxingEnabled();
    let willRunSandboxed = sandboxActive && isCommandSandboxed(input);

    return {
        destructiveWarning: destWarning,
        sandboxingEnabled: sandboxActive,
        isSandboxed: willRunSandboxed
    };
}, [command, input]);

// Title selection
let title = (sandboxingEnabled && !isSandboxed)
    ? "Bash command (unsandboxed)"  // Warning: Not sandboxed!
    : "Bash command";

// Mapping: J6→sandboxingEnabled, K6→isSandboxed, H6→destructiveWarning,
//          vA→sandboxConfigObject, Ti→isCommandSandboxed, Xw.useMemo→React.useMemo
```

---

## 9. /doctor Command Integration

### Dependency Validation Display

The `/doctor` command includes sandbox dependency validation:

```javascript
// ============================================
// /doctor - Sandbox dependency check
// Location: chunks.197.mjs:1819-1821
// ============================================

// ORIGINAL (for source lookup):
sandbox_enabled: vA.isSandboxingEnabled(),
are_unsandboxed_commands_allowed: vA.areUnsandboxedCommandsAllowed(),
is_auto_bash_allowed_if_sandbox_enabled: vA.isAutoAllowBashIfSandboxedEnabled(),

// READABLE (for understanding):
// Doctor diagnostic output includes:
{
    sandbox_enabled: sandboxConfigObject.isSandboxingEnabled(),
    are_unsandboxed_commands_allowed: sandboxConfigObject.areUnsandboxedCommandsAllowed(),
    is_auto_bash_allowed_if_sandbox_enabled: sandboxConfigObject.isAutoAllowBashIfSandboxedEnabled(),
    // ... other diagnostics
}

// Mapping: vA→sandboxConfigObject
```

### Doctor Output Format

```
## Sandbox Status
✓ Sandbox enabled: true
✓ Auto-allow bash if sandboxed: true
✗ Fallback allowed: false

## Dependencies
✓ ripgrep (rg): /usr/bin/rg
✓ bwrap: /usr/bin/bwrap (Linux only)
✓ socat: /usr/bin/socat (Linux only)
⚠ seccomp: Not available (Unix socket blocking disabled)
```

### Dependency Check Flow

```
/doctor command invoked
    │
    ├─ Check vA.isSandboxingEnabled()
    │      └─ Returns: platform support + settings check
    │
    ├─ Check oZ7() - checkDependencies()
    │      ├─ ripgrep (rg) installed?
    │      ├─ Linux: bwrap installed?
    │      ├─ Linux: socat installed?
    │      └─ Linux: seccomp binaries available?
    │
    └─ Display results with ✓/✗/⚠ indicators
```

---

## 10. Complete Status Line Lifecycle

### Component: SandboxViolationStatusLine (aIq)

**Location:** chunks.191.mjs:92-127

This component displays a transient notification when new sandbox violations are detected. It uses the observer pattern to subscribe to the SandboxViolationStore.

### Complete Implementation

```javascript
// ============================================
// SandboxViolationStatusLine - Status bar flash on new violations
// Location: chunks.191.mjs:92-127
// ============================================

// ORIGINAL (for source lookup):
function aIq() {
    let A = A6(6), [q, K] = RV6.useState(0), Y = RV6.useRef(null),
        z = Rq("app:toggleTranscript", "Global", "ctrl+o");
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) _ = () => {
        if (!vA.isSandboxingEnabled()) return;
        let H = vA.getSandboxViolationStore(), j = H.getTotalCount(),
            J = H.subscribe(() => {
                let M = H.getTotalCount(), D = M - j;
                if (D > 0) {
                    K(D); j = M;
                    if (Y.current) clearTimeout(Y.current);
                    Y.current = setTimeout(() => K(0), 5000);
                }
            });
        return () => { J(); if (Y.current) clearTimeout(Y.current) }
    }
    if (RV6.useEffect(_, w), !vA.isSandboxingEnabled() || q === 0) return null;
    let O = q === 1 ? "operation" : "operations",
        $ = jH.default.createElement(T, { dimColor: !0 }, z, " for details · /sandbox to disable");
    return jH.default.createElement(T, null, "⧈ Sandbox blocked ", q, " ", O, " ·", " ", $)
}

// READABLE (for understanding):
function SandboxViolationStatusLine() {
    let [newViolationCount, setNewViolationCount] = useState(0);
    let timeoutRef = useRef(null);

    // Get keyboard shortcut for transcript toggle
    let toggleShortcut = getKeybinding("app:toggleTranscript", "Global", "ctrl+o");

    useEffect(() => {
        // Gate: Don't subscribe if sandbox disabled
        if (!sandboxConfigObject.isSandboxingEnabled()) {
            return;
        }

        let store = sandboxConfigObject.getSandboxViolationStore();
        let lastKnownTotal = store.getTotalCount();

        // Subscribe to violation updates
        let unsubscribe = store.subscribe(() => {
            let currentTotal = store.getTotalCount();
            let delta = currentTotal - lastKnownTotal;

            if (delta > 0) {
                // New violations detected!
                setNewViolationCount(delta);
                lastKnownTotal = currentTotal;

                // Auto-dismiss after 5 seconds
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                timeoutRef.current = setTimeout(() => {
                    setNewViolationCount(0);
                }, 5000);
            }
        });

        // Cleanup on unmount
        return () => {
            unsubscribe();
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Render: Only show when there are new violations
    if (!sandboxConfigObject.isSandboxingEnabled() || newViolationCount === 0) {
        return null;
    }

    // Dynamic text based on count
    let operationWord = newViolationCount === 1 ? "operation" : "operations";

    return (
        <Text>
            ⧈ Sandbox blocked {newViolationCount} {operationWord} ·
            <Text dimColor> {toggleShortcut} for details · /sandbox to disable</Text>
        </Text>
    );
}

// Mapping: aIq→SandboxViolationStatusLine, q→newViolationCount, K→setNewViolationCount,
//          Y→timeoutRef, z→toggleShortcut, Rq→getKeybinding, vA→sandboxConfigObject,
//          RV6→React, A6→React compiler cache
```

### Lifecycle State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              SandboxViolationStatusLine Lifecycle State Machine              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐                                                        │
│  │ INITIAL MOUNT   │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐     isSandboxingEnabled()?     ┌─────────────────┐    │
│  │ CHECK SANDBOX   │────────────────────────────────▶│ RETURN null     │    │
│  │ ENABLED         │            false                │ (hidden)        │    │
│  └────────┬────────┘                                 └─────────────────┘    │
│           │ true                                                             │
│           ▼                                                                  │
│  ┌─────────────────┐                                                        │
│  │ SUBSCRIBE TO    │                                                        │
│  │ VIOLATION STORE │                                                        │
│  │                 │                                                        │
│  │ • Get store     │                                                        │
│  │ • lastTotal =   │                                                        │
│  │   getTotalCount │                                                        │
│  │ • subscribe()   │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐                                                        │
│  │ WAITING STATE   │◄──────────────────────────────────────────────┐       │
│  │                 │                                                │       │
│  │ newCount = 0    │                                                │       │
│  │ Return: null    │                                                │       │
│  │ (hidden)        │                                                │       │
│  └────────┬────────┘                                                │       │
│           │                                                         │       │
│           │ callback fires with new violation                       │       │
│           ▼                                                         │       │
│  ┌─────────────────┐                                                │       │
│  │ CALCULATE DELTA │                                                │       │
│  │                 │                                                │       │
│  │ currentTotal    │                                                │       │
│  │ - lastKnownTotal│                                                │       │
│  │ = delta         │                                                │       │
│  └────────┬────────┘                                                │       │
│           │                                                         │       │
│           │ delta > 0                                               │       │
│           ▼                                                         │       │
│  ┌─────────────────┐                                                │       │
│  │ SHOW NOTIFICATION│                                               │       │
│  │                 │                                                │       │
│  │ setNewCount(delta)                                               │       │
│  │ lastTotal = current                                              │       │
│  │ setTimeout(5s)  │                                                │       │
│  └────────┬────────┘                                                │       │
│           │                                                         │       │
│           ▼                                                         │       │
│  ┌─────────────────┐                                                │       │
│  │ VISIBLE STATE   │                                                │       │
│  │                 │                                                │       │
│  │ Render:         │                                                │       │
│  │ "⧈ Sandbox      │                                                │       │
│  │  blocked N ops" │                                                │       │
│  └────────┬────────┘                                                │       │
│           │                                                         │       │
│           │ 5 seconds pass OR new violation arrives                 │       │
│           ▼                                                         │       │
│  ┌─────────────────┐                                                │       │
│  │ AUTO-DISMISS    │────────────────────────────────────────────────┘       │
│  │                 │                                                         │
│  │ clearTimeout()  │                                                         │
│  │ setNewCount(0)  │                                                         │
│  │ → Return null   │                                                         │
│  └─────────────────┘                                                         │
│                                                                              │
│  UNMOUNT                                                                     │
│  ┌─────────────────┐                                                        │
│  │ CLEANUP         │                                                        │
│  │                 │                                                        │
│  │ unsubscribe()   │                                                        │
│  │ clearTimeout()  │                                                        │
│  └─────────────────┘                                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

**1. Delta Tracking Pattern:**

The component tracks `lastKnownTotal` to calculate delta rather than storing the full violations array:

```javascript
// Why this approach:
let delta = currentTotal - lastKnownTotal;
if (delta > 0) {
    // Only show NEW violations since last check
    // Not cumulative count of all violations
}
```

**2. Auto-Dismiss Timer:**

The 5-second auto-dismiss provides a non-intrusive notification:
- User sees the count briefly
- Notification disappears automatically
- User can use ctrl+o to see transcript for details

**3. Cleanup Pattern:**

The effect returns a cleanup function for React's lifecycle:
- Unsubscribes from store on unmount
- Clears pending timeout to prevent memory leaks
- Prevents setState on unmounted component

### Integration with Violation Store

```
SandboxViolationStore (HD6)
        │
        │ subscribe(callback)
        ▼
SandboxViolationStatusLine (aIq)
        │
        │ Receives: violations array
        │
        ├─ Check: getTotalCount() changed?
        │     └─ Calculate delta
        │     └─ Update UI if delta > 0
        │
        └─ Cleanup: unsubscribe() on unmount
```

### Example Notification Output

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ⧈ Sandbox blocked 3 operations · ctrl+o for details · /sandbox to disable │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. SandboxOverridesSettings Component (ZPq)

### What It Does

Provides UI for configuring the "open/closed" sandbox policy:
- **Open mode** (allowUnsandboxedCommands: true): Allows fallback to unsandboxed execution
- **Closed mode** (allowUnsandboxedCommands: false): Strict sandbox, no fallback allowed

### Source Code

```javascript
// ============================================
// SandboxOverridesSettings (ZPq) - Open/closed policy toggle
// Location: chunks.165.mjs:1505-1628
// ============================================

// ORIGINAL (for source lookup):
function ZPq(A) {
    let q = A6(26), { onComplete: K } = A, [Y] = z7(),
        z = vA.isSandboxingEnabled(), _ = vA.areUnsandboxedCommandsAllowed(),
        w = vA.areSandboxSettingsLockedByPolicy(), O = _ ? "open" : "closed", $;
    if (q[0] !== Y) $ = kA("success", Y)("(current)"), q[0] = Y, q[1] = $;
    else $ = q[1];
    let H = $, j = O === "open" ? `Allow unsandboxed fallback ${H}` : "Allow unsandboxed fallback", J;
    if (q[2] !== j) J = { label: j, value: "open" }, q[2] = j, q[3] = J;
    else J = q[3];
    let M = O === "closed" ? `Strict sandbox mode ${H}` : "Strict sandbox mode", D;
    if (q[4] !== M) D = { label: M, value: "closed" }, q[4] = M, q[5] = D;
    else D = q[5];
    let X;
    if (q[6] !== J || q[7] !== D) X = [J, D], q[6] = J, q[7] = D, q[8] = X;
    else X = q[8];
    let P = X, W;
    if (q[9] !== K) W = async function(u) {
        let I = u;
        await vA.setSandboxSettings({ allowUnsandboxedCommands: I === "open" }),
        K(I === "open" ? "✓ Unsandboxed fallback allowed..." : "✓ Strict sandbox mode...")
    }, q[9] = K, q[10] = W;
    else W = q[10];
    let Z = W;
    if (!z) {
        // Sandbox not enabled - show warning
        return React.createElement(Box, { flexDirection: "column", paddingY: 1 },
            React.createElement(Text, { color: "subtle" },
                "Sandbox is not enabled. Enable sandbox to configure override settings.")
        );
    }
    if (w) {
        // Settings locked by policy - show read-only
        return React.createElement(Box, { flexDirection: "column", paddingY: 1 },
            React.createElement(Text, { color: "subtle" },
                "Override settings are managed by a higher-priority configuration..."),
            React.createElement(Box, { marginTop: 1 },
                React.createElement(Text, { dimColor: true },
                    "Current setting: ", O === "closed" ? "Strict sandbox mode" : "Allow unsandboxed fallback"))
        );
    }
    // Interactive mode
    return React.createElement(Box, { flexDirection: "column", paddingY: 1 },
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { bold: true }, "Configure Overrides:")),
        React.createElement(SelectInput, { options: P, onChange: Z, onCancel: () => K(void 0, { display: "skip" }) }),
        React.createElement(Box, { flexDirection: "column", marginTop: 1, gap: 1 },
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { bold: true, dimColor: true }, "Allow unsandboxed fallback:"),
                " When a command fails due to sandbox restrictions..."),
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { bold: true, dimColor: true }, "Strict sandbox mode:"),
                " All bash commands invoked by the model must run in the sandbox..."),
            React.createElement(Text, { dimColor: true },
                "Learn more: ", React.createElement(Link, { url: "https://code.claude.com/docs/en/sandboxing#configure-sandboxing" },
                    "code.claude.com/docs/en/sandboxing#configure-sandboxing"))
        )
    );
}

// READABLE (for understanding):
function SandboxOverridesSettings({ onComplete }) {
    let [theme] = useTheme();
    let sandboxEnabled = sandboxConfigObject.isSandboxingEnabled();
    let fallbackAllowed = sandboxConfigObject.areUnsandboxedCommandsAllowed();
    let lockedByPolicy = sandboxConfigObject.areSandboxSettingsLockedByPolicy();
    let currentMode = fallbackAllowed ? "open" : "closed";

    // Build options with "(current)" marker
    let currentMarker = colorize("success", theme)("(current)");
    let options = [
        {
            label: currentMode === "open" ? `Allow unsandboxed fallback ${currentMarker}` : "Allow unsandboxed fallback",
            value: "open"
        },
        {
            label: currentMode === "closed" ? `Strict sandbox mode ${currentMarker}` : "Strict sandbox mode",
            value: "closed"
        }
    ];

    async function handleChange(selection) {
        await sandboxConfigObject.setSandboxSettings({
            allowUnsandboxedCommands: selection === "open"
        });
        onComplete(selection === "open"
            ? "✓ Unsandboxed fallback allowed - commands can run outside sandbox when necessary"
            : "✓ Strict sandbox mode - all commands must run in sandbox or be excluded via the `excludedCommands` option"
        );
    }

    // Gate: Sandbox not enabled
    if (!sandboxEnabled) {
        return (
            <Box flexDirection="column" paddingY={1}>
                <Text color="subtle">Sandbox is not enabled. Enable sandbox to configure override settings.</Text>
            </Box>
        );
    }

    // Gate: Settings locked by policy
    if (lockedByPolicy) {
        return (
            <Box flexDirection="column" paddingY={1}>
                <Text color="subtle">Override settings are managed by a higher-priority configuration and cannot be changed locally.</Text>
                <Box marginTop={1}>
                    <Text dimColor>Current setting: {currentMode === "closed" ? "Strict sandbox mode" : "Allow unsandboxed fallback"}</Text>
                </Box>
            </Box>
        );
    }

    // Interactive UI
    return (
        <Box flexDirection="column" paddingY={1}>
            <Box marginBottom={1}>
                <Text bold>Configure Overrides:</Text>
            </Box>
            <SelectInput options={options} onChange={handleChange} onCancel={() => onComplete(void 0, { display: "skip" })} />
            <Box flexDirection="column" marginTop={1} gap={1}>
                <Text dimColor>
                    <Text bold dimColor>Allow unsandboxed fallback:</Text> When a command fails due to sandbox restrictions, Claude can retry with dangerouslyDisableSandbox to run outside the sandbox (falling back to default permissions).
                </Text>
                <Text dimColor>
                    <Text bold dimColor>Strict sandbox mode:</Text> All bash commands invoked by the model must run in the sandbox unless they are explicitly listed in excludedCommands.
                </Text>
                <Text dimColor>
                    Learn more: <Link url="https://code.claude.com/docs/en/sandboxing#configure-sandboxing">code.claude.com/docs/en/sandboxing#configure-sandboxing</Link>
                </Text>
            </Box>
        </Box>
    );
}

// Mapping: ZPq→SandboxOverridesSettings, K→onComplete, vA→sandboxConfigObject,
//          Y→theme, z→sandboxEnabled, _→fallbackAllowed, w→lockedByPolicy
```

### State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   SandboxOverridesSettings State Machine                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ENTRY: Component mounts with { onComplete }                                │
│       │                                                                      │
│       ├─ Check: isSandboxingEnabled()                                       │
│       │       │                                                              │
│       │       └─ false ──► Show "Enable sandbox first" message              │
│       │                   Return (no interactive UI)                         │
│       │                                                                      │
│       ├─ Check: areSandboxSettingsLockedByPolicy()                          │
│       │       │                                                              │
│       │       └─ true ──► Show read-only current setting                    │
│       │                   Return (no interactive UI)                         │
│       │                                                                      │
│       └─ Interactive Mode                                                    │
│               │                                                              │
│               ├─ Build options array with (current) marker                  │
│               │                                                              │
│               └─ Render SelectInput                                         │
│                       │                                                      │
│                       ├─ User selects "open"                                │
│                       │       └─ setSandboxSettings({ allowUnsandboxedCommands: true })│
│                       │       └─ onComplete("✓ Unsandboxed fallback allowed...")│
│                       │                                                      │
│                       ├─ User selects "closed"                              │
│                       │       └─ setSandboxSettings({ allowUnsandboxedCommands: false })│
│                       │       └─ onComplete("✓ Strict sandbox mode...")     │
│                       │                                                      │
│                       └─ User cancels                                        │
│                               └─ onComplete(void 0, { display: "skip" })    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. SandboxDependenciesPanel Component (Ql8)

### What It Does

Displays the status of sandbox dependencies:
- **bwrap** (Linux): Bubblewrap for filesystem/process isolation
- **socat** (Linux): Socket bridging for network namespace
- **seccomp** (Linux): BPF filter for Unix socket blocking

### Source Code

```javascript
// ============================================
// SandboxDependenciesPanel (Ql8) - Dependency status display
// Location: chunks.165.mjs:1641-1735
// ============================================

// ORIGINAL (for source lookup):
function Ql8(A) {
    let q = A6(31), { depCheck: K } = A, Y;
    if (q[0] !== K.errors) Y = K.errors.some(CAz), q[0] = K.errors, q[1] = Y;
    else Y = q[1];
    let z = Y, _ = K.warnings.length > 0;
    // ... builds UI showing errors and warnings ...
}

// READABLE (for understanding):
function SandboxDependenciesPanel({ depCheck }) {
    // depCheck structure: { errors: [...], warnings: [...] }
    // Each error/warning: { message: string, tool?: string, platform?: string }

    let hasCriticalErrors = depCheck.errors.some(isCriticalError);
    let hasWarnings = depCheck.warnings.length > 0;

    // Group errors by type
    let bwrapErrors = depCheck.errors.filter(e => e.tool === "bwrap");
    let socatErrors = depCheck.errors.filter(e => e.tool === "socat");
    let seccompErrors = depCheck.errors.filter(e => e.tool === "seccomp");
    let seccompWarnings = depCheck.warnings.filter(w => w.tool === "seccomp");

    return (
        <Box flexDirection="column" paddingY={1}>
            <Box marginBottom={1}>
                <Text bold>Dependencies:</Text>
            </Box>

            {/* bwrap status */}
            <Box flexDirection="column">
                <Text>
                    {bwrapErrors.length > 0 ? "✗" : "✓"} bwrap (bubblewrap)
                </Text>
                {bwrapErrors.map((error, i) => (
                    <Text key={i} color="error" dimColor>
                        {error.message}
                    </Text>
                ))}
            </Box>

            {/* socat status */}
            <Box flexDirection="column">
                <Text>
                    {socatErrors.length > 0 ? "✗" : "✓"} socat (socket bridging)
                </Text>
                {socatErrors.map((error, i) => (
                    <Text key={i} color="error" dimColor>
                        {error.message}
                    </Text>
                ))}
            </Box>

            {/* seccomp status */}
            <Box flexDirection="column">
                <Text>
                    {seccompErrors.length > 0 ? "✗" : "✓"} seccomp (Unix socket blocking)
                </Text>
                {seccompErrors.map((error, i) => (
                    <Text key={i} color="error" dimColor>
                        {error.message}
                    </Text>
                ))}
                {seccompWarnings.map((warning, i) => (
                    <Text key={i} color="warning" dimColor>
                        {warning.message}
                    </Text>
                ))}
            </Box>

            {/* Installation hints if errors */}
            {hasCriticalErrors && (
                <Box flexDirection="column" marginTop={1}>
                    <Text dimColor>Install dependencies:</Text>
                    <Text dimColor>  • npm install -g @anthropic-ai/sandbox-runtime</Text>
                    <Text dimColor>  • or copy vendor/seccomp/* from sandbox-runtime</Text>
                </Box>
            )}
        </Box>
    );
}

// Mapping: Ql8→SandboxDependenciesPanel, K→depCheck, CAz→isCriticalError
```

### Dependency Check Structure

```javascript
// Result from vA.checkDependencies()
{
    errors: [
        { message: "bwrap not found in PATH", tool: "bwrap", platform: "linux" },
        { message: "seccomp BPF filter not found for arm64", tool: "seccomp", platform: "linux" }
    ],
    warnings: [
        { message: "socat not found - network namespace isolation may not work", tool: "socat", platform: "linux" }
    ]
}
```

### Display Logic

| Condition | Display | Color |
|-----------|---------|-------|
| No errors, no warnings | ✓ tool-name | Green |
| Has errors | ✗ tool-name | Red |
| Has warnings | ⚠ tool-name | Yellow |

---

## Summary

This document covers the complete UI interaction patterns for the sandbox module:

1. **State Machine** - Dynamic description generation, mode transitions
2. **Observer Pattern** - Violation store with subscriber notifications
3. **Persistence Flow** - Settings write → event → UI update
4. **Permission Integration** - Sandbox-aware permission prompts
5. **Dependency Validation** - Error/warning classification
6. **Permission Prompt Flow** - Complete context computation and title logic
7. **/doctor Integration** - Sandbox status display in diagnostics

---

**Last Updated**: 2026-03-25
**Version**: Claude Code 2.1.76
**Status**: Complete - All UI interaction patterns documented with source code