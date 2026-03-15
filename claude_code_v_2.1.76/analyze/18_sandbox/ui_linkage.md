# Sandbox UI Linkage (Claude Code 2.1.38)

## Overview

The sandbox system has deep UI integration across multiple layers: a dedicated `/sandbox` slash command with an interactive multi-tab interface, real-time violation indicators in the status line, a violation list panel in the transcript, a "Bash command (unsandboxed)" title in the permission prompt, a doctor check for dependency validation, and system prompt injections that teach the model how to use `dangerouslyDisableSandbox`. All UI components subscribe to `SandboxViolationStore` (dy1) via its observer pattern and read live state from `sandboxConfigObject` (b8).

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Sandbox section)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components

Key functions in this document:
- `sandboxSlashCommandHandler` (oqz) - Dispatches `/sandbox` subcommands and renders interactive UI
- `sandboxSlashCommandDefinition` (aqz) - Slash command descriptor with live status in description
- `SandboxModeSelector` (_Hq) - 3-way mode picker (auto-allow / regular / disabled)
- `SandboxStatusDisplay` (zHq) - Shows active configuration summary
- `SandboxOverridesSettings` (HHq) - Toggles open/closed (unsandboxed fallback) policy
- `SandboxDependenciesPanel` (nuA) - Dependency status for bwrap, socat, seccomp filter
- `SandboxViolationStatusLine` (lWq) - Status bar flash on new violations (macOS)
- `SandboxViolationListPanel` (HLq) - Detailed violation log in tool result area
- `SandboxDoctorCheck` (Q7q) - Dependency warnings inside `/doctor`
- `getSandboxSystemPromptBlock` (nBY) - System prompt instructions injected into Bash tool

---

## 1. `/sandbox` Slash Command

### Architecture: How It's Defined

```javascript
// ============================================
// sandboxSlashCommandDefinition - Slash command descriptor with live sandbox status
// Location: chunks.165.mjs:1781-1811 (Ln 427457)
// ============================================

// ORIGINAL (for source lookup):
aqz = {
    name: "sandbox",
    get description() {
        let A = b8.isSandboxingEnabled(), q = b8.isAutoAllowBashIfSandboxedEnabled(),
            K = b8.areUnsandboxedCommandsAllowed(), Y = b8.areSandboxSettingsLockedByPolicy(),
            z = b8.checkDependencies().errors.length === 0, w;
        if (!z) w = l1.warning;
        else w = A ? l1.tick : l1.circle;
        let H = "sandbox disabled";
        if (A) H = q ? "sandbox enabled (auto-allow)" : "sandbox enabled",
            H += K ? ", fallback allowed" : "";
        if (Y) H += " (managed)";
        return `${w} ${H} (⏎ to configure)`
    },
    argumentHint: 'exclude "command pattern"',
    isEnabled: () => !0,
    isHidden: !b8.isSupportedPlatform() || !b8.isPlatformInEnabledList(),
    immediate: !0,
    type: "local-jsx",
    ...
}

// READABLE (for understanding):
sandboxSlashCommandDefinition = {
    name: "sandbox",
    get description() {
        let sandboxEnabled = b8.isSandboxingEnabled();
        let autoAllow = b8.isAutoAllowBashIfSandboxedEnabled();
        let fallbackAllowed = b8.areUnsandboxedCommandsAllowed();
        let isManaged = b8.areSandboxSettingsLockedByPolicy();
        let depsOk = b8.checkDependencies().errors.length === 0;

        // Icon: warning if deps missing, tick if enabled, circle if disabled
        let icon = !depsOk ? "⚠" : sandboxEnabled ? "✓" : "○";
        let statusText = "sandbox disabled";
        if (sandboxEnabled) {
            statusText = autoAllow ? "sandbox enabled (auto-allow)" : "sandbox enabled";
            statusText += fallbackAllowed ? ", fallback allowed" : "";
        }
        if (isManaged) statusText += " (managed)";
        return `${icon} ${statusText} (⏎ to configure)`;
    },
    argumentHint: 'exclude "command pattern"',
    isEnabled: () => true,
    // Hidden if platform is unsupported or excluded via enabledPlatforms
    isHidden: !b8.isSupportedPlatform() || !b8.isPlatformInEnabledList(),
    immediate: true,
    type: "local-jsx",
    userFacingName: () => "sandbox",
    load: () => Promise.resolve().then(() => (MHq(), jHq))
}

// Mapping: aqz->sandboxSlashCommandDefinition
```

**What it does:** The description is a getter (computed live), so every time the slash command list re-renders, it shows the current sandbox state. The icon is:
- `⚠` if dependencies have errors (bwrap not installed, etc.)
- `✓` if sandbox is enabled
- `○` if sandbox is disabled

### Dispatch Logic

```javascript
// ============================================
// sandboxSlashCommandHandler - Dispatches /sandbox subcommands
// Location: chunks.165.mjs:1723-1780 (Ln 427401)
// ============================================

// ORIGINAL (for source lookup):
async function oqz(A, q, K) {
    u8("sandbox");
    let z = C8().theme || "light", w = eA();
    if (!b8.isSupportedPlatform()) {
        let O = w === "wsl" ? "Error: Sandboxing requires WSL2..." : "Error: Only macOS, Linux, WSL2",
            _ = k8("error", z)(O);
        return A(_), null
    }
    let H = b8.checkDependencies();
    if (!b8.isPlatformInEnabledList()) { /* return error */ }
    if (b8.areSandboxSettingsLockedByPolicy()) { /* return error */ }
    let $ = K?.trim() || "";
    if (!$) return DHq.default.createElement(_Hq, { onComplete: A, depCheck: H });
    if ($) {
        let _ = $.split(" ")[0];
        if (_ === "exclude") {
            let J = $.slice(8).trim();
            if (!J) return A(errorMessage), null;
            let X = J.replace(/^["']|["']$/g, "");  // Strip quotes
            ae8(X);  // addExcludedCommand
            let D = Vw("localSettings"), j = D ? relative(cwd(), D) : ".claude/settings.local.json",
                M = k8("success", z)(`Added "${X}" to excluded commands in ${j}`);
            return A(M), null
        }
        return A(error), null
    }
}

// READABLE (for understanding):
async function sandboxSlashCommandHandler(renderResult, _, subcommandArgs) {
    trackUsage("sandbox");
    let theme = getSettings().theme || "light";
    let platform = getPlatform();

    // Platform gate checks
    if (!b8.isSupportedPlatform()) {
        let msg = platform === "wsl" ? "Error: Sandboxing requires WSL2." : "Error: Only macOS, Linux, and WSL2 supported.";
        return renderResult(colorize("error", theme)(msg)), null;
    }
    let depCheck = b8.checkDependencies();
    if (!b8.isPlatformInEnabledList()) return renderResult(colorize("error", theme)(`Error: Disabled for platform ${platform} via enabledPlatforms`)), null;
    if (b8.areSandboxSettingsLockedByPolicy()) return renderResult(colorize("error", theme)("Error: Settings locked by higher-priority config.")), null;

    // No subcommand: show interactive UI
    let args = subcommandArgs?.trim() || "";
    if (!args) return React.createElement(SandboxModeSelector, { onComplete: renderResult, depCheck });

    // Subcommand: "exclude <pattern>"
    let subcommand = args.split(" ")[0];
    if (subcommand === "exclude") {
        let pattern = args.slice(8).trim().replace(/^["']|["']$/g, "");  // strip quotes
        if (!pattern) return renderResult(colorize("error", theme)('Error: Provide a pattern, e.g. /sandbox exclude "npm run test:*"')), null;
        addExcludedCommand(pattern);
        let settingsPath = getLocalSettingsPath() ? relative(getCwd(), getLocalSettingsPath()) : ".claude/settings.local.json";
        return renderResult(colorize("success", theme)(`Added "${pattern}" to excluded commands in ${settingsPath}`)), null;
    }
    return renderResult(colorize("error", theme)(`Error: Unknown subcommand "${subcommand}". Available: exclude`)), null;
}

// Mapping: oqz->sandboxSlashCommandHandler, A->renderResult, K->subcommandArgs, DHq->React, _Hq->SandboxModeSelector, ae8->addExcludedCommand, k8->colorize, C8->getSettings, eA->getPlatform, b8->sandboxConfigObject
```

**Key insight:** `immediate: true` means the command renders inline in the chat without requiring an extra Enter press. The `type: "local-jsx"` means it returns a React component rather than a string. The `onComplete` callback receives either JSX (to show inline) or a string (status message), and optionally `{ display: "skip" }` to dismiss without showing anything.

---

## 2. SandboxModeSelector Component

**What it does:** The main interactive UI when `/sandbox` is called without arguments. Shows three radio-style options and describes each mode.

```javascript
// ============================================
// SandboxModeSelector - Interactive 3-way sandbox mode picker
// Location: chunks.165.mjs:1517-1675 (Ln 427195)
// ============================================

// ORIGINAL (for source lookup):
function _Hq(A) {
    let { onComplete: K, depCheck: Y } = A,
        [z] = T7(), w = b8.isSandboxingEnabled(), H = b8.isAutoAllowBashIfSandboxedEnabled(),
        $ = Y.warnings.length > 0,
        J = O.sandbox?.network?.allowAllUnixSockets,
        X = $ && !J,  // show unix socket warning
        j = (() => {
            if (!w) return "disabled"; if (H) return "auto-allow"; return "regular"
        })();
    // ... builds options list, renders SelectInput
    // onChange: calls b8.setSandboxSettings({enabled, autoAllowBashIfSandboxed})
}

// READABLE (for understanding):
function SandboxModeSelector({ onComplete, depCheck }) {
    let [theme] = useTheme();
    let sandboxEnabled = b8.isSandboxingEnabled();
    let autoAllow = b8.isAutoAllowBashIfSandboxedEnabled();
    let hasWarnings = depCheck.warnings.length > 0;
    let settings = getSettings();
    let allowAllUnixSockets = settings.sandbox?.network?.allowAllUnixSockets;
    let showUnixSocketWarning = hasWarnings && !allowAllUnixSockets;

    let currentMode = !sandboxEnabled ? "disabled" : autoAllow ? "auto-allow" : "regular";
    let currentLabel = colorize("success", theme)("(current)");

    // Options array:
    let options = [
        { label: currentMode === "auto-allow" ? `Sandbox BashTool, with auto-allow ${currentLabel}` : "Sandbox BashTool, with auto-allow", value: "auto-allow" },
        { label: currentMode === "regular" ? `Sandbox BashTool, with regular permissions ${currentLabel}` : "Sandbox BashTool, with regular permissions", value: "regular" },
        { label: currentMode === "disabled" ? `No Sandbox ${currentLabel}` : "No Sandbox", value: "disabled" }
    ];

    async function handleChange(selection) {
        switch (selection) {
            case "auto-allow":
                await b8.setSandboxSettings({ enabled: true, autoAllowBashIfSandboxed: true });
                onComplete("✓ Sandbox enabled with auto-allow for bash commands");
                break;
            case "regular":
                await b8.setSandboxSettings({ enabled: true, autoAllowBashIfSandboxed: false });
                onComplete("✓ Sandbox enabled with regular bash permissions");
                break;
            case "disabled":
                await b8.setSandboxSettings({ enabled: false, autoAllowBashIfSandboxed: false });
                onComplete("○ Sandbox disabled");
                break;
        }
    }

    // Renders warning if unix socket blocking unavailable
    // Then renders <TabPanel title="Sandbox:"> with tabs:
    //   - "Mode" (the mode picker)
    //   - "Overrides" (open/closed policy)
    //   - "Status" (current config summary)
    //   - "Dependencies" (if warnings: bwrap, socat, seccomp)
}

// Mapping: _Hq->SandboxModeSelector, K->onComplete, Y->depCheck
```

**How it works:**
1. Determines `currentMode` from live sandbox API state
2. Marks current selection with a green `(current)` suffix
3. On selection, calls `b8.setSandboxSettings()` which writes to `localSettings.json`
4. The result is shown inline via `onComplete` callback
5. Tabs: Mode → Overrides → Status → Dependencies (conditionally shown)

**Why this approach:**
- The `(current)` marker dynamically follows the live state, so if sandbox was previously configured it's always clear
- Three distinct modes cover the full configuration space: OS isolation with auto-approve, OS isolation with manual approve, or no isolation
- Warning about unix socket blocking is shown inline to explain why bwrap alone isn't sufficient

---

## 3. SandboxStatusDisplay Component

**What it does:** Shows the current sandbox configuration summary -- filesystem rules, network rules, unix socket allowlist, and Linux glob pattern warnings.

```javascript
// ============================================
// SandboxStatusDisplay - Configuration summary UI
// Location: chunks.165.mjs:1179-1268 (Ln 426863)
// ============================================

// ORIGINAL (for source lookup):
function zHq() {
    let A = e(3), q = b8.isSandboxingEnabled();
    if (!q) return "Sandbox is not enabled";
    // Calls: getFsReadConfig(), getFsWriteConfig(), getNetworkRestrictionConfig(),
    //        getAllowUnixSockets(), getExcludedCommands(), getLinuxGlobPatternWarnings()
    // Renders each as a bold label + dimmed value
}

// READABLE (for understanding):
function SandboxStatusDisplay() {
    let sandboxEnabled = b8.isSandboxingEnabled();
    if (!sandboxEnabled) return <Text color="subtle">Sandbox is not enabled</Text>;

    let readConfig = b8.getFsReadConfig();    // { denyOnly: [...] }
    let writeConfig = b8.getFsWriteConfig();  // { allowOnly: [...], denyWithinAllow: [...] }
    let networkConfig = b8.getNetworkRestrictionConfig(); // { allowedHosts, deniedHosts }
    let allowUnixSockets = b8.getAllowUnixSockets();
    let excludedCommands = b8.getExcludedCommands();
    let globWarnings = b8.getLinuxGlobPatternWarnings();

    return (
        <Box flexDirection="column" paddingY={1}>
            <Box flexDirection="column">
                <Text bold color="permission">Excluded Commands:</Text>
                <Text dimColor>{excludedCommands.length > 0 ? excludedCommands.join(", ") : "None"}</Text>
            </Box>
            {readConfig.denyOnly.length > 0 && (
                <Box marginTop={1} flexDirection="column">
                    <Text bold color="permission">Filesystem Read Restrictions:</Text>
                    <Text dimColor>Denied: {readConfig.denyOnly.join(", ")}</Text>
                </Box>
            )}
            {writeConfig.allowOnly.length > 0 && (
                <Box marginTop={1} flexDirection="column">
                    <Text bold color="permission">Filesystem Write Restrictions:</Text>
                    <Text dimColor>Allowed: {writeConfig.allowOnly.join(", ")}</Text>
                    {writeConfig.denyWithinAllow.length > 0 && (
                        <Text dimColor>Denied within allowed: {writeConfig.denyWithinAllow.join(", ")}</Text>
                    )}
                </Box>
            )}
            {(networkConfig.allowedHosts?.length > 0 || networkConfig.deniedHosts?.length > 0) && (
                <Box marginTop={1} flexDirection="column">
                    <Text bold color="permission">
                        Network Restrictions{isManagedDomainsPolicy() ? " (Managed)" : ""}:
                    </Text>
                    {/* allowedHosts and deniedHosts lists */}
                </Box>
            )}
            {allowUnixSockets?.length > 0 && (
                <Box marginTop={1} flexDirection="column">
                    <Text bold color="permission">Allowed Unix Sockets:</Text>
                    <Text dimColor>{allowUnixSockets.join(", ")}</Text>
                </Box>
            )}
            {globWarnings.length > 0 && (
                <Box marginTop={1} flexDirection="column">
                    <Text bold color="warning">⚠ Warning: Glob patterns not fully supported on Linux</Text>
                    <Text dimColor>The following patterns will be ignored: {globWarnings.slice(0, 3).join(", ")}{globWarnings.length > 3 ? ` (${globWarnings.length-3} more)` : ""}</Text>
                </Box>
            )}
        </Box>
    );
}

// Mapping: zHq->SandboxStatusDisplay
```

**Key insight:** The network config label appends `(Managed)` when `isManagedDomainsPolicy()` (KC1) is true -- i.e., when `policySettings.sandbox.network.allowManagedDomainsOnly` is set. This tells users that the allowed domains list is controlled by enterprise policy and they cannot change it locally.

---

## 4. SandboxOverridesSettings Component

**What it does:** Lets users toggle between "open" (unsandboxed fallback allowed) and "closed" (strict mode, all commands must sandbox) override policies.

```javascript
// ============================================
// SandboxOverridesSettings - open/closed override policy selector
// Location: chunks.165.mjs:1967-1410 (Ln 426967)
// ============================================

// READABLE (for understanding):
function SandboxOverridesSettings({ onComplete }) {
    let sandboxEnabled = b8.isSandboxingEnabled();
    let fallbackAllowed = b8.areUnsandboxedCommandsAllowed();  // "open" = true, "closed" = false
    let isManaged = b8.areSandboxSettingsLockedByPolicy();

    if (!sandboxEnabled) return <Text color="subtle">Sandbox is not enabled. Enable sandbox to configure override settings.</Text>;

    let currentMode = fallbackAllowed ? "open" : "closed";
    let options = [
        { label: currentMode === "open" ? `Allow unsandboxed fallback (current)` : "Allow unsandboxed fallback", value: "open" },
        { label: currentMode === "closed" ? `Strict sandbox mode (current)` : "Strict sandbox mode", value: "closed" }
    ];

    async function handleChange(selection) {
        await b8.setSandboxSettings({ allowUnsandboxedCommands: selection === "open" });
        if (selection === "open") {
            onComplete("✓ Unsandboxed fallback allowed - commands can run outside sandbox when necessary");
        } else {
            onComplete("✓ Strict sandbox mode - all commands must run in sandbox or be excluded");
        }
    }

    // Bottom descriptions:
    // "Allow unsandboxed fallback: When a command fails due to sandbox restrictions,
    //  Claude can retry with dangerouslyDisableSandbox to run outside the sandbox."
    // "Strict sandbox mode: All bash commands invoked by the model must run in the sandbox
    //  unless they are explicitly listed in excludedCommands."
    // Link: code.claude.com/docs/en/sandboxing#configure-sandboxing
}

// Mapping: HHq->SandboxOverridesSettings
```

**Why this distinction matters:**
- **Open mode**: `dangerouslyDisableSandbox: true` requests from the model are honored (after user approval). The model can self-heal from sandbox failures.
- **Closed mode**: Even if the model sets `dangerouslyDisableSandbox: true`, it is ignored by `isSandboxed()` (Sc). The only way to run outside sandbox is to add the command to `excludedCommands`.

---

## 5. SandboxDependenciesPanel Component

**What it does:** Shows the status of each sandbox dependency on Linux: `bwrap` (bubblewrap), `socat`, and the `seccomp` filter. Indicates how to install missing ones.

```javascript
// ============================================
// SandboxDependenciesPanel - Linux dependency status display
// Location: chunks.165.mjs:1421-1510 (Ln 427101)
// ============================================

// READABLE (for understanding):
function SandboxDependenciesPanel({ depCheck }) {
    let bwrapMissing = depCheck.errors.some(e => e.includes("bwrap"));
    let socatMissing = depCheck.errors.some(e => e.includes("socat"));
    let seccompMissing = depCheck.warnings.length > 0;  // seccomp is optional (warning, not error)

    return (
        <Box flexDirection="column" paddingY={1} gap={1}>
            <Box flexDirection="column">
                <Text>bubblewrap (bwrap): {bwrapMissing ? <Text color="error">not installed</Text> : <Text color="success">installed</Text>}</Text>
                {bwrapMissing && <Text dimColor>  · apt install bubblewrap</Text>}
            </Box>
            <Box flexDirection="column">
                <Text>socat: {socatMissing ? <Text color="error">not installed</Text> : <Text color="success">installed</Text>}</Text>
                {socatMissing && <Text dimColor>  · apt install socat</Text>}
            </Box>
            <Box flexDirection="column">
                <Text>seccomp filter: {seccompMissing ? <Text color="warning">not installed</Text> : <Text color="success">installed</Text>} {seccompMissing && "(required to block unix domain sockets)"}</Text>
                {seccompMissing && (
                    <Box flexDirection="column">
                        <Text dimColor>  · npm install -g @anthropic-ai/sandbox-runtime</Text>
                        <Text dimColor>  · or copy vendor/seccomp/* from sandbox-runtime and set</Text>
                        <Text dimColor>    sandbox.seccomp.bpfPath and applyPath in settings.json</Text>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

// Mapping: nuA->SandboxDependenciesPanel, K->depCheck
```

**Key insight:** `bwrap` and `socat` are hard errors (sandbox cannot function without them). `seccomp` is a soft warning -- the sandbox works but Unix domain sockets can escape network isolation. The panel tells the user exactly which apt package to install or which npm package to install for the seccomp filter.

---

## 6. Permission Prompt Integration

### "Bash command (unsandboxed)" Title

When the permission prompt appears for a Bash tool call, the title reflects whether the command will run sandboxed:

```javascript
// ============================================
// BashPermissionPrompt - sandbox-aware title
// Location: chunks.180.mjs:2224-2330 (Ln ~)
// ============================================

// ORIGINAL (for source lookup):
let T1 = b8.isSandboxingEnabled(), N1 = T1 && Sc(A.input);
// ...
title: T1 && !N1 ? "Bash command (unsandboxed)" : "Bash command"

// READABLE (for understanding):
let isSandboxActive = b8.isSandboxingEnabled();
let willRunSandboxed = isSandboxActive && isCommandSandboxed(input);

// Title changes based on execution context:
let title = (isSandboxActive && !willRunSandboxed) ? "Bash command (unsandboxed)" : "Bash command";
```

**How it works:**
- If sandbox is enabled AND the command is sandboxed → `"Bash command"` (no special notice needed)
- If sandbox is enabled AND the command is **NOT** sandboxed (due to `dangerouslyDisableSandbox: true` or `excludedCommands` match) → `"Bash command (unsandboxed)"` (warns user this runs without isolation)
- If sandbox is disabled → `"Bash command"` (always, since everything is unsandboxed)

### sandboxOverride Decision Reason

When `dangerouslyDisableSandbox: true` triggers a permission ask, the reason displayed is:

```javascript
// chunks.180.mjs:819-820
case "sandboxOverride":
    return "Requires permission to bypass sandbox";

// chunks.172.mjs:1846-1847
case "sandboxOverride":
    return "Run outside of the sandbox";
```

Two different strings are used in different contexts:
- The short form `"Run outside of the sandbox"` is used in the brief inline decision reason
- `"Requires permission to bypass sandbox"` is used in the full permission prompt header

---

## 7. SandboxViolationStatusLine Component

**What it does:** Shows a transient notification in the status bar whenever new sandbox violations are detected. Auto-dismisses after 5 seconds.

```javascript
// ============================================
// SandboxViolationStatusLine - Status bar flash on new violations (macOS only)
// Location: chunks.182.mjs:1592-1644 (Ln 472208)
// ============================================

// ORIGINAL (for source lookup):
function lWq() {
    let A = e(6), [q, K] = yf1.useState(0), Y = yf1.useRef(null),
        z = RK("app:toggleTranscript", "Global", "ctrl+o");
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) w = () => {
        if (!b8.isSandboxingEnabled()) return;
        let _ = b8.getSandboxViolationStore(), J = _.getTotalCount(),
            X = _.subscribe(() => {
                let D = _.getTotalCount(), j = D - J;
                if (j > 0) {
                    K(j); J = D;
                    if (Y.current) clearTimeout(Y.current);
                    Y.current = setTimeout(() => K(0), 5000);
                }
            });
        return () => { X(); if (Y.current) clearTimeout(Y.current) }
    }
    if (yf1.useEffect(w, H), !b8.isSandboxingEnabled() || q === 0) return null;
    return "⧈ Sandbox blocked {q} {operations} · ctrl+o for details · /sandbox to disable"
}

// READABLE (for understanding):
function SandboxViolationStatusLine() {
    let [newViolationCount, setNewViolationCount] = useState(0);
    let timeoutRef = useRef(null);
    let detailsKeybinding = getKeybinding("app:toggleTranscript", "Global", "ctrl+o");

    useEffect(() => {
        if (!b8.isSandboxingEnabled()) return;
        let store = b8.getSandboxViolationStore();
        let lastKnownCount = store.getTotalCount();

        let unsubscribe = store.subscribe(() => {
            let currentCount = store.getTotalCount();
            let delta = currentCount - lastKnownCount;
            if (delta > 0) {
                setNewViolationCount(delta);   // Show the flash
                lastKnownCount = currentCount;
                clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => setNewViolationCount(0), 5000);  // Auto-dismiss
            }
        });
        return () => { unsubscribe(); clearTimeout(timeoutRef.current); };
    }, []);

    if (!b8.isSandboxingEnabled() || newViolationCount === 0) return null;

    let noun = newViolationCount === 1 ? "operation" : "operations";
    return (
        <Text color="inactive">
            ⧈ Sandbox blocked {newViolationCount} {noun} · {detailsKeybinding} for details · /sandbox to disable
        </Text>
    );
}

// Mapping: lWq->SandboxViolationStatusLine, K->setNewViolationCount, z->detailsKeybinding
```

**How it works:**
1. Subscribes to `SandboxViolationStore` (dy1) on mount
2. Tracks `lastKnownCount` -- when total increases, computes the delta
3. Displays the delta count (not the total) to show "new violations just happened"
4. Auto-dismisses after 5 seconds via setTimeout
5. Returns `null` if: sandbox is disabled, OR no new violations since last dismiss

**Key insight:** The component shows the **delta** (new violations since last reset), not the total count. This is important because a command that generates many violations shouldn't keep the notification visible indefinitely. The 5-second timeout provides a pulsing effect for repeated violations.

---

## 8. SandboxViolationListPanel Component (macOS only)

**What it does:** Shows the last 10 sandbox violations with timestamps and violation description. Appears in the tool result area (transcript). Only shown on macOS since the Linux sandbox has no violation monitor.

```javascript
// ============================================
// SandboxViolationListPanel - Detailed violation log (macOS only)
// Location: chunks.187.mjs:~485694 (Ln 485694)
// ============================================

// ORIGINAL (for source lookup):
function HLq() {
    let A = e(15), q;
    // ...subscribe to violation store, store last 10 violations
    if (tc1.useEffect(H, $), !b8.isSandboxingEnabled() || eA() === "linux") return null;
    if (z === 0) return null;
    return (
        "⧈ Sandbox blocked {z} total operations"
        // then map K.map(qWz) -- each violation as a timestamped line
        // then "… showing last X of Y"
    );
}

// READABLE (for understanding):
function SandboxViolationListPanel() {
    let [recentViolations, setRecentViolations] = useState([]);
    let [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        let store = b8.getSandboxViolationStore();
        return store.subscribe((violations) => {
            setRecentViolations(violations.slice(-10));  // Keep last 10
            setTotalCount(store.getTotalCount());
        });
    }, []);

    // Only for macOS -- Linux has no log monitor
    if (!b8.isSandboxingEnabled() || getPlatform() === "linux") return null;
    if (totalCount === 0) return null;

    let noun = totalCount === 1 ? "operation" : "operations";
    return (
        <Box flexDirection="column" marginTop={1}>
            <Box marginLeft={0}>
                <Text color="permission">⧈ Sandbox blocked {totalCount} total {noun}</Text>
            </Box>
            {recentViolations.map((v, i) => (
                <Box key={`${v.timestamp.getTime()}-${i}`} paddingLeft={2}>
                    <Text dimColor>
                        {formatTime(v.timestamp, "h:mm:ssa")}{v.command ? ` ${v.command}:` : ""} {v.line}
                    </Text>
                </Box>
            ))}
            <Box paddingLeft={2}>
                <Text dimColor>… showing last {Math.min(10, recentViolations.length)} of {totalCount}</Text>
            </Box>
        </Box>
    );
}

// READABLE violation renderer:
function renderViolationEntry(violation, index) {
    return (
        <Box key={`${violation.timestamp.getTime()}-${index}`} paddingLeft={2}>
            <Text dimColor>
                {formatTime(violation.timestamp, "h:mm:ssa")}
                {violation.command ? ` ${violation.command}:` : ""}
                {" "}{violation.line}  {/* The actual sandbox deny message */}
            </Text>
        </Box>
    );
}

// Mapping: HLq->SandboxViolationListPanel, qWz->renderViolationEntry
```

**Key insight:** Each violation entry includes:
- `timestamp` - when the violation occurred (from `new Date()` in log monitor)
- `command` - the decoded command string (up to 100 chars, decoded from base64)
- `line` - the raw violation text from macOS log (e.g., `Sandbox: file-write* deny /etc/passwd`)

This gives users actionable information: they can see exactly which command triggered which deny, enabling them to either add the path to `allowWrite` or add the command to `excludedCommands`.

---

## 9. SandboxDoctorCheck Component

**What it does:** Shown inside `/doctor` output when sandbox is enabled in settings but has dependency errors or warnings.

```javascript
// ============================================
// SandboxDoctorCheck - Dependency warning in /doctor
// Location: chunks.154.mjs:2979-3040 (Ln 396902)
// ============================================

// ORIGINAL (for source lookup):
function Q7q() {
    let A = e(2);
    if (!b8.isSupportedPlatform()) return null;
    if (!b8.isSandboxEnabledInSettings()) return null;
    // Build dependency error/warning display
}

// READABLE (for understanding):
function SandboxDoctorCheck() {
    if (!b8.isSupportedPlatform()) return null;           // Only macOS/Linux/WSL
    if (!b8.isSandboxEnabledInSettings()) return null;    // Only when sandbox enabled in settings

    let depCheck = b8.checkDependencies();
    let hasErrors = depCheck.errors.length > 0;
    let hasWarnings = depCheck.warnings.length > 0;
    if (!hasErrors && !hasWarnings) return null;          // All good, nothing to show

    return (
        <Box flexDirection="column">
            <Text bold>Sandbox</Text>
            <Text>└ Status: {hasErrors ? <Text color="error">Missing dependencies</Text> : <Text color="warning">Available (with warnings)</Text>}</Text>
            {depCheck.errors.map((e, i) => <Text key={i} color="error">└ {e}</Text>)}
            {depCheck.warnings.map((w, i) => <Text key={i} color="warning">└ {w}</Text>)}
            {hasErrors && <Text dimColor>└ Run /sandbox for install instructions</Text>}
        </Box>
    );
}

// Mapping: Q7q->SandboxDoctorCheck
```

**Why this approach:** The doctor check uses `isSandboxEnabledInSettings()` (le8) rather than `isSandboxingEnabled()` (Nq6). The difference is important:
- `isSandboxEnabledInSettings()` checks only the `sandbox.enabled` setting (returns true even if deps are broken)
- `isSandboxingEnabled()` additionally checks that platform is supported AND dependencies are OK

So if a user has `sandbox.enabled: true` but bwrap is missing, the doctor check correctly shows the dependency error while `isSandboxingEnabled()` returns false (preventing actual sandboxing attempts).

---

## 10. System Prompt Injection: getSandboxSystemPromptBlock

**What it does:** Injects sandbox configuration and behavioral instructions directly into the system prompt for the Bash tool, teaching the model when and how to use `dangerouslyDisableSandbox`.

```javascript
// ============================================
// getSandboxSystemPromptBlock - Sandbox instructions for Bash tool system prompt
// Location: chunks.146.mjs:883-950 (Ln 372152)
// ============================================

// ORIGINAL (for source lookup):
function nBY() {
    if (!b8.isSandboxingEnabled()) return "";
    let A = b8.getFsReadConfig(), q = b8.getFsWriteConfig(), K = b8.getNetworkRestrictionConfig(),
        Y = b8.getAllowUnixSockets(), z = b8.getIgnoreViolations(), w = b8.areUnsandboxedCommandsAllowed();
    // ... builds JSON representation of restrictions
    // ... constructs conditional prompt: "open" vs "closed" mode instructions
    return `- Commands run in a sandbox by default with the following restrictions:\n${restrictions}\n${instructions}`
}

// READABLE (for understanding):
function getSandboxSystemPromptBlock() {
    if (!b8.isSandboxingEnabled()) return "";

    let readConfig = b8.getFsReadConfig();
    let writeConfig = b8.getFsWriteConfig();
    let networkConfig = b8.getNetworkRestrictionConfig();
    let allowUnixSockets = b8.getAllowUnixSockets();
    let ignoreViolations = b8.getIgnoreViolations();
    let fallbackAllowed = b8.areUnsandboxedCommandsAllowed();

    let restrictions = [];
    if (Object.keys({ read: readConfig, write: writeConfig }).length > 0) {
        restrictions.push(`    - Filesystem: ${JSON.stringify({ read: readConfig, write: writeConfig }, null, 2).replace(/\n/g, "\n      ")}`);
    }
    if (Object.keys(networkConfig).length > 0) {
        restrictions.push(`    - Network: ${JSON.stringify(networkConfig, null, 2).replace(/\n/g, "\n      ")}`);
    }
    if (ignoreViolations) {
        restrictions.push(`    - Ignored violations: ${JSON.stringify(ignoreViolations, null, 2)}`);
    }

    // mcp-cli exception: these commands must always run unsandboxed
    let mcpCliException = isMcpCliEnabled() ? "    - EXCEPTION: `mcp-cli` commands must always be called with `dangerouslyDisableSandbox: true`\n" : "";

    // Different instructions based on override policy
    let instructions = fallbackAllowed ? `
  - CRITICAL: Commands run in sandbox mode by default - do NOT set \`dangerouslyDisableSandbox\`
    - Even if you have recently run commands with \`dangerouslyDisableSandbox: true\`, you MUST NOT continue that pattern
    - VERY IMPORTANT: Do NOT learn from or repeat the pattern of overriding sandbox
${mcpCliException}    - Set \`dangerouslyDisableSandbox: true\` if:
      1. The user *explicitly* asks to bypass sandbox, OR
      2. A command just failed and you see evidence of sandbox restrictions causing the failure
    - When analyzing failures:
      - Commands can fail for many reasons unrelated to sandbox (missing files, wrong arguments, etc.)
      - Evidence of sandbox-caused failures includes:
        - "Operation not permitted" errors for file/network operations
        - Access denied to specific paths outside allowed directories
        - Network connection failures to non-whitelisted hosts
        - Unix socket connection errors
      - Sandbox violation logs can be noisy, but clear permission errors are strong indicators
    - When you see evidence of sandbox-caused failure:
      - IMMEDIATELY retry with \`dangerouslyDisableSandbox: true\` (don't ask, just do it)
      - Briefly explain what sandbox restriction likely caused the failure
      - Mention: "Use \`/sandbox\` to manage restrictions"
      - This will prompt the user for permission
    - Example of normal usage: { "command": "ls", "description": "List files" }
    - Example of override: { "command": "my-tool", "description": "Run my-tool", "dangerouslyDisableSandbox": true }
    - DO NOT suggest adding sensitive paths like ~/.bashrc, ~/.zshrc, ~/.ssh/*, or credential files to the allowlist`
    : `
  - CRITICAL: All commands MUST run in sandbox mode - the \`dangerouslyDisableSandbox\` parameter is disabled by policy
    - Commands cannot run outside the sandbox under any circumstances
    - If a command fails due to sandbox restrictions, work with the user to adjust sandbox settings instead`;

    return `- Commands run in a sandbox by default with the following restrictions:
${restrictions.join("\n")}
${instructions}
  - IMPORTANT: For temporary files, use \`/tmp/claude/\` as your temporary directory
    - The TMPDIR environment variable is automatically set to \`/tmp/claude\` when running in sandbox mode
    - Do NOT use \`/tmp\` directly - use \`/tmp/claude/\` or rely on TMPDIR instead`;
}

// Mapping: nBY->getSandboxSystemPromptBlock, w->fallbackAllowed, b8->sandboxConfigObject
```

**How it works:**
1. Returns empty string if sandbox is disabled (no noise in unsandboxed mode)
2. Serializes the current restrictions as JSON to give the model exact context
3. **Open mode** (`areUnsandboxedCommandsAllowed()` = true): Teaches the model to retry with `dangerouslyDisableSandbox: true` when detecting sandbox failures. Includes detailed heuristics for identifying sandbox-caused failures vs. other errors.
4. **Closed mode**: Tells the model that `dangerouslyDisableSandbox` is disabled by policy. No retry instructions.

**Key insight:** The "CRITICAL: do NOT continue the pattern" instruction specifically combats an LLM failure mode where the model, having used `dangerouslyDisableSandbox: true` once successfully, starts applying it to all subsequent commands out of habit. The instruction explicitly warns against this learned behavior.

**Why restrictions are serialized as JSON:** Rather than describing the restrictions in natural language, the code passes the raw configuration objects to the model. This prevents ambiguity and allows the model to precisely reason about whether a given path or domain is allowed.

---

## Complete UI Linkage Flow Diagram

```
User Input / Agent Loop
        |
        v
   Sandbox enabled?
   isSandboxingEnabled() (Nq6)
        |
   +----+----+
   | YES     | NO --> Standard execution, no UI differences
   v
Command needs execution
        |
        +---> wrapWithSandbox() called (eP5/vG5)
        |     |
        |     v
        |   [OS-level isolation active]
        |
        v
Permission check (zmA)
        |
   isCommandSandboxed()? (Sc)
        |
   +----+----+
   | YES     | NO (excluded or dangerouslyDisableSandbox=true)
   |         |
   v         v
Auto-allow   Permission Prompt shown
(no UI)      Title: "Bash command (unsandboxed)"
             decisionReason.type = "sandboxOverride"
             → "Run outside of the sandbox"

After execution:
        |
        v
   annotateStderrWithSandboxFailures() (YW5)
        |
   macOS: <sandbox_violations>...</sandbox_violations> appended to stderr
        |
        v
   SandboxViolationStore (dy1) updated by log monitor (ze8)
        |
        +---> SandboxViolationStatusLine (lWq) [status bar, auto-dismiss 5s]
        +---> SandboxViolationListPanel (HLq) [transcript panel, last 10]
        +---> getSandboxViolationStore() [model reads via tool result]

/sandbox command:
        |
        v
   oqz() dispatches to:
        +---> _Hq (SandboxModeSelector)      [interactive mode picker]
              |-- zHq (SandboxStatusDisplay) [Status tab]
              |-- HHq (SandboxOverridesSettings) [Overrides tab]
              +-- nuA (SandboxDependenciesPanel)  [Dependencies tab]

System Prompt assembly:
        |
        v
   nBY() → embedded in Bash tool system prompt
   Teaches model: when to set dangerouslyDisableSandbox,
                  what temp directory to use,
                  what constitutes a sandbox failure
```

---

## Settings Reactivity

The sandbox configuration automatically syncs when settings change:

```javascript
// ============================================
// initializeSandboxFromSettings - One-time init with settings-change subscription
// Location: chunks.47.mjs:3-20 (Ln 123753)
// ============================================

// READABLE (for understanding):
async function initializeSandboxFromSettings(networkPermissionCallback) {
    if (sandboxInitPromise) return sandboxInitPromise;  // Already initializing or initialized
    if (!b8.isSandboxingEnabled()) return;              // Skip if disabled

    let settings = getSettings();
    let config = buildSandboxConfigFromSettings(settings);

    sandboxInitPromise = (async () => {
        try {
            await hO.initialize(config, networkPermissionCallback);

            // Subscribe to settings changes: auto-update sandbox config live
            settingsUnsubscribe = subscribeToSettings(() => {
                let newSettings = getSettings();
                let newConfig = buildSandboxConfigFromSettings(newSettings);
                hO.updateConfig(newConfig);
                log("Sandbox configuration updated from settings change");
            });
        } catch (error) {
            sandboxInitPromise = undefined;
            log(`Failed to initialize sandbox: ${error.message}`);
        }
    })();

    return sandboxInitPromise;
}

// Mapping: EG5->initializeSandboxFromSettings, Or->sandboxInitPromise, r8A->settingsUnsubscribe
```

**Key insight:** The settings subscription (`r8A`) means the sandbox config updates live when the user changes settings (e.g., adds a path to `allowWrite` in their settings file). No restart required. The `hO.updateConfig()` call updates `c3` (the internal config variable in chunks.44/45), which then gets used on the next `wrapWithSandbox()` call.
