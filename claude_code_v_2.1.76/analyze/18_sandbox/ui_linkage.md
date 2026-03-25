# Sandbox UI Linkage (Claude Code 2.1.76)

## Overview

The sandbox system has deep UI integration across multiple layers: a dedicated `/sandbox` slash command with an interactive multi-tab interface, real-time violation indicators in the status line, a violation list panel in the transcript, a "Bash command (unsandboxed)" title in the permission prompt, a doctor check for dependency validation, and system prompt injections that teach the model how to use `dangerouslyDisableSandbox`. All UI components subscribe to `SandboxViolationStore` (HD6) via its observer pattern and read live state from `sandboxConfigObject` (vA).

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Sandbox section)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components

Key functions in this document:
- `sandboxSlashCommandDefinition` (bAz) - Slash command descriptor with live status in description
- `SandboxModeSelector` (TPq) - 3-way mode picker (auto-allow / regular / disabled)
- `SandboxStatusDisplay` (PPq) - Shows active configuration summary
- `SandboxOverridesSettings` (ZPq) - Toggles open/closed (unsandboxed fallback) policy
- `SandboxDependenciesPanel` (Ql8) - Dependency status for bwrap, socat, seccomp filter
- `SandboxViolationStatusLine` (aIq) - Status bar flash on new violations (macOS)
- `getSandboxSystemPromptBlock` (E9z) - System prompt instructions injected into Bash tool

---

## 1. `/sandbox` Slash Command

### Architecture: How It's Defined

```javascript
// ============================================
// sandboxSlashCommandDefinition - Slash command descriptor with live sandbox status
// Location: chunks.165.mjs:2007-2032
// ============================================

// ORIGINAL (for source lookup):
bAz = {
    name: "sandbox",
    get description() {
        let A = vA.isSandboxingEnabled(), q = vA.isAutoAllowBashIfSandboxedEnabled(),
            K = vA.areUnsandboxedCommandsAllowed(), Y = vA.areSandboxSettingsLockedByPolicy(),
            z = vA.checkDependencies().errors.length === 0, w;
        if (!z) w = a6.warning;
        else w = A ? a6.tick : a6.circle;
        let H = "sandbox disabled";
        if (A) H = q ? "sandbox enabled (auto-allow)" : "sandbox enabled",
            H += K ? ", fallback allowed" : "";
        if (Y) H += " (managed)";
        return `${w} ${H} (⏎ to configure)`
    },
    argumentHint: 'exclude "command pattern"',
    isEnabled: () => !0,
    get isHidden() {
        return !vA.isSupportedPlatform() || !vA.isPlatformInEnabledList()
    },
    immediate: !0,
    type: "local-jsx",
    userFacingName: () => "sandbox",
    load: () => Promise.resolve().then(() => (EPq(), kPq))
}

// READABLE (for understanding):
sandboxSlashCommandDefinition = {
    name: "sandbox",
    get description() {
        let sandboxEnabled = vA.isSandboxingEnabled();
        let autoAllow = vA.isAutoAllowBashIfSandboxedEnabled();
        let fallbackAllowed = vA.areUnsandboxedCommandsAllowed();
        let isManaged = vA.areSandboxSettingsLockedByPolicy();
        let depsOk = vA.checkDependencies().errors.length === 0;

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
    get isHidden() {
        return !vA.isSupportedPlatform() || !vA.isPlatformInEnabledList();
    },
    immediate: true,
    type: "local-jsx",
    userFacingName: () => "sandbox",
    load: () => Promise.resolve().then(() => sandboxUIComponent)
}

// Mapping: bAz->sandboxSlashCommandDefinition, vA->sandboxConfigObject,
//          a6->iconSet, a6.tick->✓, a6.circle->○, a6.warning->⚠
```

**What it does:** The description is a getter (computed live), so every time the slash command list re-renders, it shows the current sandbox state. The icon is:
- `⚠` if dependencies have errors (bwrap not installed, etc.)
- `✓` if sandbox is enabled
- `○` if sandbox is disabled

### Dispatch Logic

```javascript
// ============================================
// sandboxSlashCommandHandler - Dispatches /sandbox subcommands
// Location: chunks.165.mjs:1916-1990
// ============================================

// READABLE (for understanding):
async function sandboxSlashCommandHandler(renderResult, _, subcommandArgs) {
    trackUsage("sandbox");
    let theme = getSettings().theme || "light";
    let platform = getPlatform();

    // Platform gate checks
    if (!vA.isSupportedPlatform()) {
        let msg = platform === "wsl" ? "Error: Sandboxing requires WSL2." : "Error: Only macOS, Linux, and WSL2 supported.";
        return renderResult(colorize("error", theme)(msg)), null;
    }
    let depCheck = vA.checkDependencies();
    if (!vA.isPlatformInEnabledList()) return renderResult(colorize("error", theme)(`Error: Disabled for platform ${platform} via enabledPlatforms`)), null;
    if (vA.areSandboxSettingsLockedByPolicy()) return renderResult(colorize("error", theme)("Error: Settings locked by higher-priority config.")), null;

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

// Mapping: vA->sandboxConfigObject, TPq->SandboxModeSelector
```

**Key insight:** `immediate: true` means the command renders inline in the chat without requiring an extra Enter press. The `type: "local-jsx"` means it returns a React component rather than a string. The `onComplete` callback receives either JSX (to show inline) or a string (status message), and optionally `{ display: "skip" }` to dismiss without showing anything.

---

## 2. SandboxModeSelector Component

**What it does:** The main interactive UI when `/sandbox` is called without arguments. Shows three radio-style options and describes each mode.

```javascript
// ============================================
// SandboxModeSelector (TPq) - Interactive 3-way sandbox mode picker
// Location: chunks.165.mjs:1737-1870
// ============================================

// ORIGINAL (for source lookup):
function TPq(A) {
    let q = A6(43),
        { onComplete: K, depCheck: Y } = A,
        [z] = z7(),
        _ = vA.isSandboxingEnabled(),
        w = vA.isAutoAllowBashIfSandboxedEnabled(),
        O = Y.warnings.length > 0,
        $ = PA(),        // get settings
        j = $.sandbox?.network?.allowAllUnixSockets,
        J = O && !j,     // show unix socket warning
        D = (() => {
            if (!_) return "disabled"; if (w) return "auto-allow"; return "regular"
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
                await vA.setSandboxSettings({ enabled: true, autoAllowBashIfSandboxed: true });
                onComplete("✓ Sandbox enabled with auto-allow for bash commands");
                break;
            case "regular":
                await vA.setSandboxSettings({ enabled: true, autoAllowBashIfSandboxed: false });
                onComplete("✓ Sandbox enabled with regular bash permissions");
                break;
            case "disabled":
                await vA.setSandboxSettings({ enabled: false, autoAllowBashIfSandboxed: false });
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

// Mapping: TPq->SandboxModeSelector, K->onComplete, Y->depCheck, vA->sandboxConfigObject
```

**How it works:**
1. Determines `currentMode` from live sandbox API state
2. Marks current selection with a green `(current)` suffix
3. On selection, calls `vA.setSandboxSettings()` which writes to `localSettings.json`
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
// SandboxStatusDisplay (PPq) - Configuration summary UI
// Location: chunks.165.mjs:1399-1487
// ============================================

// ORIGINAL (for source lookup):
function PPq() {
    let A = A6(3), q = vA.isSandboxingEnabled();
    if (!q) return "Sandbox is not enabled";
    // Calls: getFsReadConfig(), getFsWriteConfig(), getNetworkRestrictionConfig(),
    //        getAllowUnixSockets(), getExcludedCommands(), getLinuxGlobPatternWarnings()
    // Renders each as a bold label + dimmed value
}

// READABLE (for understanding):
function SandboxStatusDisplay() {
    let sandboxEnabled = vA.isSandboxingEnabled();
    if (!sandboxEnabled) return <Text color="subtle">Sandbox is not enabled</Text>;

    let readConfig = vA.getFsReadConfig();    // { denyOnly: [...] }
    let writeConfig = vA.getFsWriteConfig();  // { allowOnly: [...], denyWithinAllow: [...] }
    let networkConfig = vA.getNetworkRestrictionConfig(); // { allowedHosts, deniedHosts }
    let allowUnixSockets = vA.getAllowUnixSockets();
    let excludedCommands = vA.getExcludedCommands();
    let globWarnings = vA.getLinuxGlobPatternWarnings();

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

// Mapping: PPq->SandboxStatusDisplay, vA->sandboxConfigObject
```

**Key insight:** The network config label appends `(Managed)` when `isManagedDomainsPolicy()` (KC1) is true -- i.e., when `policySettings.sandbox.network.allowManagedDomainsOnly` is set. This tells users that the allowed domains list is controlled by enterprise policy and they cannot change it locally.

---

## 4. SandboxOverridesSettings Component

**What it does:** Lets users toggle between "open" (unsandboxed fallback allowed) and "closed" (strict mode, all commands must sandbox) override policies.

```javascript
// ============================================
// SandboxOverridesSettings (ZPq) - open/closed override policy selector
// Location: chunks.165.mjs:1505-1620
// ============================================

// READABLE (for understanding):
function SandboxOverridesSettings({ onComplete }) {
    let sandboxEnabled = vA.isSandboxingEnabled();
    let fallbackAllowed = vA.areUnsandboxedCommandsAllowed();  // "open" = true, "closed" = false
    let isManaged = vA.areSandboxSettingsLockedByPolicy();

    if (!sandboxEnabled) return <Text color="subtle">Sandbox is not enabled. Enable sandbox to configure override settings.</Text>;

    let currentMode = fallbackAllowed ? "open" : "closed";
    let options = [
        { label: currentMode === "open" ? `Allow unsandboxed fallback (current)` : "Allow unsandboxed fallback", value: "open" },
        { label: currentMode === "closed" ? `Strict sandbox mode (current)` : "Strict sandbox mode", value: "closed" }
    ];

    async function handleChange(selection) {
        await vA.setSandboxSettings({ allowUnsandboxedCommands: selection === "open" });
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

// Mapping: ZPq->SandboxOverridesSettings, vA->sandboxConfigObject
```

**Why this distinction matters:**
- **Open mode**: `dangerouslyDisableSandbox: true` requests from the model are honored (after user approval). The model can self-heal from sandbox failures.
- **Closed mode**: Even if the model sets `dangerouslyDisableSandbox: true`, it is ignored by `isSandboxed()` (Ti). The only way to run outside sandbox is to add the command to `excludedCommands`.

---

## 5. SandboxDependenciesPanel Component

**What it does:** Shows the status of each sandbox dependency on Linux: `bwrap` (bubblewrap), `socat`, and the `seccomp` filter. Indicates how to install missing ones.

```javascript
// ============================================
// SandboxDependenciesPanel (Ql8) - Linux dependency status display
// Location: chunks.165.mjs:1641-1725
// ============================================

// ORIGINAL (for source lookup):
function Ql8(A) {
    let q = A6(31), { depCheck: K } = A,
        Y = K.errors.some(CAz),  // bwrap missing
        z = K.errors.some(SAz),  // socat missing
        _ = K.warnings.length > 0;  // seccomp missing
    // Renders status for each dependency...
}

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

// Mapping: Ql8->SandboxDependenciesPanel, K->depCheck
```

**Key insight:** `bwrap` and `socat` are hard errors (sandbox cannot function without them). `seccomp` is a soft warning -- the sandbox works but Unix domain sockets can escape network isolation. The panel tells the user exactly which apt package to install or which npm package to install for the seccomp filter.

---

## 6. Permission Prompt Integration

### "Bash command (unsandboxed)" Title

When the permission prompt appears for a Bash tool call, the title reflects whether the command will run sandboxed:

```javascript
// ============================================
// BashPermissionPrompt - sandbox-aware title
// Location: chunks.189.mjs:405-420
// ============================================

// ORIGINAL (for source lookup):
let J6 = vA.isSandboxingEnabled(), K6 = Ti(A.input);  // will command be sandboxed?
title: J6 && !K6 ? "Bash command (unsandboxed)" : "Bash command"

// READABLE (for understanding):
let isSandboxActive = vA.isSandboxingEnabled();
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
// chunks.172.mjs:2544-2545
case "sandboxOverride":
    return "Run outside of the sandbox";
```

---

## 7. SandboxViolationStatusLine Component

**What it does:** Shows a transient notification in the status bar whenever new sandbox violations are detected. Auto-dismisses after 5 seconds.

```javascript
// ============================================
// SandboxViolationStatusLine (aIq) - Status bar flash on new violations (macOS only)
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
    return "⧈ Sandbox blocked {q} {operations} · ctrl+o for details · /sandbox to disable"
}

// READABLE (for understanding):
function SandboxViolationStatusLine() {
    let [newViolationCount, setNewViolationCount] = useState(0);
    let timeoutRef = useRef(null);
    let detailsKeybinding = getKeybinding("app:toggleTranscript", "Global", "ctrl+o");

    useEffect(() => {
        if (!vA.isSandboxingEnabled()) return;
        let store = vA.getSandboxViolationStore();
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

// Mapping: aIq->SandboxViolationStatusLine, K->setNewViolationCount, z->detailsKeybinding, vA->sandboxConfigObject
```

**How it works:**
1. Subscribes to `SandboxViolationStore` (HD6) on mount
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
// Location: chunks.55.mjs:3391-3393 (violation annotation in stderr)
// ============================================

// READABLE (for understanding):
function SandboxViolationListPanel() {
    let [recentViolations, setRecentViolations] = useState([]);
    let [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        let store = vA.getSandboxViolationStore();
        return store.subscribe((violations) => {
            setRecentViolations(violations.slice(-10));  // Keep last 10
            setTotalCount(store.getTotalCount());
        });
    }, []);

    // Only for macOS -- Linux has no log monitor
    if (!vA.isSandboxingEnabled() || getPlatform() === "linux") return null;
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

// Mapping: vA->sandboxConfigObject
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

// Mapping: E9z->getSandboxSystemPromptBlock, w->fallbackAllowed, vA->sandboxConfigObject
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
   SandboxViolationStore (HD6) updated by log monitor (UZ7)
        |
        +---> SandboxViolationStatusLine (aIq) [status bar, auto-dismiss 5s]
        +---> SandboxViolationListPanel [transcript panel, last 10]
        +---> getSandboxViolationStore() [model reads via tool result]

/sandbox command:
        |
        v
   bAz() dispatches to:
        +---> TPq (SandboxModeSelector)      [interactive mode picker]
              |-- PPq (SandboxStatusDisplay) [Status tab]
              |-- ZPq (SandboxOverridesSettings) [Overrides tab]
              +-- Ql8 (SandboxDependenciesPanel)  [Dependencies tab]

System Prompt assembly:
        |
        v
   E9z() → embedded in Bash tool system prompt
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
    if (!vA.isSandboxingEnabled()) return;              // Skip if disabled

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

---

## 11. Violation Indicator Animation Behavior

### Status Line Flash Pattern

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Violation Indicator Animation                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Timeline:                                                                   │
│                                                                              │
│  T=0s   Violation detected                                                  │
│         ┌─────────────────────────────────────────────────────────────┐    │
│         │ ⧈ Sandbox blocked 1 operation · ctrl+o for details          │    │
│         └─────────────────────────────────────────────────────────────┘    │
│         count = 1, visible = true                                           │
│                                                                              │
│  T=2s   Second violation (while first still visible)                        │
│         ┌─────────────────────────────────────────────────────────────┐    │
│         │ ⧈ Sandbox blocked 2 operations · ctrl+o for details         │    │
│         └─────────────────────────────────────────────────────────────┘    │
│         count = 2 (delta), timer reset to 5s from now                       │
│                                                                              │
│  T=7s   Auto-dismiss (5s after last violation)                              │
│         ┌─────────────────────────────────────────────────────────────┐    │
│         │ (status line hidden)                                         │    │
│         └─────────────────────────────────────────────────────────────┘    │
│         count = 0, visible = false                                          │
│                                                                              │
│  T=10s  New violation after dismissal                                       │
│         ┌─────────────────────────────────────────────────────────────┐    │
│         │ ⧈ Sandbox blocked 1 operation · ctrl+o for details          │    │
│         └─────────────────────────────────────────────────────────────┘    │
│         Fresh delta count, new 5s timer                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key behaviors:**
1. **Delta count, not total**: Shows new violations since last reset, not cumulative
2. **Timer reset on new violation**: Each new violation extends visibility by 5s
3. **Consecutive violations accumulate**: 3 violations in 1s = "blocked 3 operations"
4. **Clean slate after dismiss**: After 5s idle, count resets to 0

### Animation State Machine

```javascript
// ============================================
// Violation indicator state machine
// ============================================

// States:
// - IDLE: No violations, indicator hidden
// - VISIBLE: Violations displayed, timer running
// - DISMISSED: Timer fired, indicator hidden

// Transitions:
// IDLE --[violation]--> VISIBLE (count=1, start 5s timer)
// VISIBLE --[violation]--> VISIBLE (count++, reset timer to 5s)
// VISIBLE --[5s timeout]--> IDLE (count=0)
// VISIBLE --[component unmount]--> IDLE (cleanup timer)

// Implementation pattern:
let [count, setCount] = useState(0);
let timerRef = useRef(null);

function onViolation(delta) {
    setCount(prev => prev + delta);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCount(0), 5000);
}
```

---

## 12. Mode Selector State Transitions

### Three-Way Mode Selector

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Sandbox Mode Selector State Machine                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Available Modes:                                                            │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Mode 1: auto-allow                                                   │    │
│  │   enabled: true                                                      │    │
│  │   autoAllowBashIfSandboxed: true                                     │    │
│  │   Behavior: All bash commands auto-approved, run in sandbox         │    │
│  │   Use case: Trusted environment, quick iteration                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Mode 2: regular                                                      │    │
│  │   enabled: true                                                      │    │
│  │   autoAllowBashIfSandboxed: false                                    │    │
│  │   Behavior: Bash commands require permission, run in sandbox        │    │
│  │   Use case: Standard security posture                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Mode 3: disabled                                                     │    │
│  │   enabled: false                                                     │    │
│  │   autoAllowBashIfSandboxed: false                                    │    │
│  │   Behavior: No OS-level isolation, standard permissions             │    │
│  │   Use case: Troubleshooting, constrained environments               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  State Transitions (via /sandbox UI):                                       │
│                                                                              │
│         ┌───────────────┐                                                  │
│         │   disabled    │                                                  │
│         │   (current)   │◄─────────────────────────┐                       │
│         └───────┬───────┘                          │                       │
│                 │ select "auto-allow"             │ select "disabled"     │
│                 │ [setSandboxSettings]            │ [setSandboxSettings]  │
│                 ▼                                  │                       │
│         ┌───────────────┐                          │                       │
│         │  auto-allow   │                          │                       │
│         │   (current)   │◄───────┐                │                       │
│         └───────┬───────┘        │                │                       │
│                 │ select "regular"                │                       │
│                 │ [setSandboxSettings]            │                       │
│                 ▼                │                │                       │
│         ┌───────────────┐        │                │                       │
│         │   regular     │────────┘                │                       │
│         │   (current)   │─────────────────────────┘                       │
│         └───────────────┘  select "disabled"                              │
│                              [setSandboxSettings]                          │
│                                                                              │
│  Note: (current) marker follows live state via getter                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Override Policy Toggle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Override Policy State Machine                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Precondition: Sandbox must be enabled (modes 1 or 2)                       │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ open mode                                                           │    │
│  │   allowUnsandboxedCommands: true                                    │    │
│  │   Behavior:                                                         │    │
│  │   - Model can request dangerouslyDisableSandbox: true              │    │
│  │   - User sees permission prompt: "Run outside of the sandbox"      │    │
│  │   - Self-healing: Model retries failed commands unsandboxed        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                           ▲                       │                          │
│                           │ toggle                │ toggle                  │
│                           └───────────────────────┘                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ closed mode                                                         │    │
│  │   allowUnsandboxedCommands: false                                   │    │
│  │   Behavior:                                                         │    │
│  │   - dangerouslyDisableSandbox parameter is ignored                 │    │
│  │   - No permission prompts for sandbox bypass                       │    │
│  │   - Model must work within sandbox constraints                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Note: Closed mode enforces strictest security posture                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 13. /doctor Integration Details

### Sandbox Doctor Check Triggers

```javascript
// ============================================
// When SandboxDoctorCheck appears in /doctor
// ============================================

// Conditions checked:
// 1. Platform must be supported (macOS, Linux, WSL)
// 2. Sandbox must be enabled in settings
// 3. Dependencies must have errors OR warnings

// Show conditions:
if (isSupportedPlatform() && isSandboxEnabledInSettings()) {
    let depCheck = checkDependencies();
    if (depCheck.errors.length > 0 || depCheck.warnings.length > 0) {
        // Show the check panel
    }
}

// DepCheck structure:
{
    errors: [
        "bubblewrap (bwrap) not found - install with: apt install bubblewrap",
        "socat not found - install with: apt install socat"
    ],
    warnings: [
        "seccomp filter not found - Unix domain sockets will not be blocked"
    ]
}

// Error = sandbox cannot function
// Warning = sandbox works but with reduced security
```

### Doctor Output Format

```
Sandbox
└ Status: Missing dependencies
└ bubblewrap (bwrap) not found - install with: apt install bubblewrap
└ socat not found - install with: apt install socat
└ Run /sandbox for install instructions

-- OR --

Sandbox
└ Status: Available (with warnings)
└ seccomp filter not found - Unix domain sockets will not be blocked
└ Install @anthropic-ai/sandbox-runtime for full protection

-- OR --

(No sandbox section if all dependencies OK)
```

---

## 14. Permission Prompt UI for Unsandboxed Commands

### Title Variation Based on Sandbox State

**Location:** `chunks.189.mjs:411`

```javascript
// ============================================
// BashPermissionPrompt - Title shows sandbox context
// Location: chunks.189.mjs:409-471
// ============================================

// ORIGINAL (for source lookup):
return N$.default.createElement(cz, {
    workerBadge: _,
    title: J6 && !K6 ? "Bash command (unsandboxed)" : "Bash command",
    subtitle: void 0
}, ...)

// READABLE (for understanding):
function BashPermissionPrompt(props) {
    // Determine if sandbox is active and command will be sandboxed
    let isSandboxEnabled = vA.isSandboxingEnabled();
    let willRunSandboxed = isCommandSandboxed(props.input);

    // Title varies based on sandbox context
    let title = (isSandboxEnabled && !willRunSandboxed)
        ? "Bash command (unsandboxed)"  // Warning: not sandboxed!
        : "Bash command";                // Normal or sandboxed

    return (
        <PermissionDialog workerBadge={workerBadge} title={title}>
            {/* Command display */}
            <Text dimColor={feedbackMode.visible}>
                {renderToolUseMessage({ command, description }, { verbose: true })}
            </Text>

            {/* Permission options */}
            <SelectInput
                options={permissionOptions}
                onChange={handlePermissionChange}
            />
        </PermissionDialog>
    );
}

// Mapping: J6→isSandboxEnabled, K6→willRunSandboxed, N$→React, cz→PermissionDialog
```

### Key Design Decision: Title as Warning

**Why "(unsandboxed)" in title:**
- Alerts user that this command will NOT run in sandbox
- Distinguishes from normal sandboxed commands
- Provides clear visual warning in permission prompt history

### When This Happens

The "(unsandboxed)" title appears when:
1. Sandbox is enabled globally (`isSandboxingEnabled() === true`)
2. Model set `dangerouslyDisableSandbox: true`
3. `allowUnsandboxedCommands` policy allows it
4. Command is NOT in exclusion list

```
┌─────────────────────────────────────────────────────────────────────────────┐
│           Permission Prompt Title Decision Flow                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  isSandboxingEnabled()?                                                      │
│       │                                                                      │
│       ├─ false → "Bash command" (sandbox not active)                        │
│       │                                                                      │
│       └─ true ──► isCommandSandboxed(input)?                                │
│                         │                                                    │
│                         ├─ true → "Bash command" (runs in sandbox)          │
│                         │                                                    │
│                         └─ false → "Bash command (unsandboxed)"              │
│                                    (model requested bypass)                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 15. Complete UI Interaction Flow

### End-to-End Sandbox Configuration Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE SANDBOX UI INTERACTION FLOW                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User types /sandbox                                                         │
│       │                                                                      │
│       ▼                                                                      │
│  Slash command matched (bAz)                                                │
│       │                                                                      │
│       ├─ description getter evaluated:                                      │
│       │    • isSandboxingEnabled() → ✓ or ○                                │
│       │    • isAutoAllowBashIfSandboxedEnabled() → auto-allow status        │
│       │    • areUnsandboxedCommandsAllowed() → fallback status              │
│       │    • checkDependencies() → ⚠ if errors                             │
│       │                                                                      │
│       ▼                                                                      │
│  Load sandbox UI component (kPq)                                            │
│       │                                                                      │
│       ├─ SandboxStatusDisplay (PPq)                                         │
│       │    • Show current config summary                                    │
│       │    • Dependency status (bwrap, socat, seccomp)                      │
│       │                                                                      │
│       ├─ Tab 1: Mode (SandboxModeSelector - TPq)                            │
│       │    • Option 1: "Sandbox BashTool, with auto-allow"                  │
│       │    • Option 2: "Sandbox BashTool, with regular permissions"          │
│       │    • Option 3: "No Sandbox"                                         │
│       │    • onChange → setSandboxSettings()                                │
│       │                                                                      │
│       ├─ Tab 2: Overrides (SandboxOverridesSettings - ZPq)                  │
│       │    • Open/Closed toggle for unsandboxed fallback                    │
│       │    • onChange → setSandboxSettings()                                │
│       │                                                                      │
│       └─ Tab 3: Dependencies (SandboxDependenciesPanel - Ql8)               │
│            • bwrap: ✓ installed / ✗ missing                                 │
│            • socat: ✓ installed / ✗ missing                                 │
│            • seccomp: ✓ available / ⚠ not found                             │
│                                                                              │
│  User selects option                                                         │
│       │                                                                      │
│       ▼                                                                      │
│  setSandboxSettings() (Mx3)                                                 │
│       │                                                                      │
│       ├─ Write to localSettings                                             │
│       ├─ Settings change event fired                                        │
│       ├─ Settings subscription triggers                                      │
│       └─ aO.updateConfig() called                                           │
│                                                                              │
│  UI updates                                                                  │
│       │                                                                      │
│       ├─ SandboxStatusDisplay re-renders                                    │
│       ├─ Description getter shows new status                                │
│       └─ Mode selector shows "(current)" marker                             │
│                                                                              │
│  User presses Esc or clicks away                                            │
│       │                                                                      │
│       └─ UI dismisses, slash command history updated                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Permission Prompt Flow with Sandbox Context

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PERMISSION PROMPT SANDBOX FLOW                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Model calls Bash tool                                                      │
│       │                                                                      │
│       ├─ dangerouslyDisableSandbox: undefined (default)                     │
│       │    or                                                               │
│       ├─ dangerouslyDisableSandbox: true (explicit bypass request)          │
│       │                                                                      │
│       ▼                                                                      │
│  Permission check (checkBashPermissionWithSandbox)                          │
│       │                                                                      │
│       ├─ auto-allow enabled && sandbox enabled && isCommandSandboxed?       │
│       │    └─ Auto-allow, no prompt                                          │
│       │                                                                      │
│       └─ Normal permission flow                                              │
│            │                                                                 │
│            ▼                                                                 │
│       Build permission prompt                                                │
│            │                                                                 │
│            ├─ title = isSandboxEnabled && !willRunSandboxed                 │
│            │       ? "Bash command (unsandboxed)"                            │
│            │       : "Bash command"                                          │
│            │                                                                 │
│            └─ Show prompt with options                                       │
│                 • Yes (with optional feedback)                               │
│                 • No (with optional feedback)                                │
│                 • Yes + add permission rule                                  │
│                                                                              │
│  User approves                                                               │
│       │                                                                      │
│       ▼                                                                      │
│  Execute command                                                             │
│       │                                                                      │
│       ├─ willRunSandboxed → wrap with sandbox-exec/bwrap                    │
│       │    • Network isolation                                              │
│       │    • Filesystem restrictions                                        │
│       │    • Violation monitoring (macOS)                                   │
│       │                                                                      │
│       └─ !willRunSandboxed → Execute directly                               │
│            • No OS-level isolation                                           │
│            • Normal permissions                                              │
│                                                                              │
│  Command completes                                                           │
│       │                                                                      │
│       ├─ stdout/stderr returned                                             │
│       ├─ Violations annotated (macOS)                                       │
│       └─ SandboxViolationStatusLine updates if violations                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Real-Time Violation Indicator Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    REAL-TIME VIOLATION INDICATOR FLOW                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  (macOS only)                                                                │
│                                                                              │
│  Sandboxed command runs                                                     │
│       │                                                                      │
│       ├─ Attempts denied operation                                          │
│       │    (e.g., write to /etc/passwd)                                     │
│       │                                                                      │
│       ▼                                                                      │
│  macOS kernel denies operation                                              │
│       │                                                                      │
│       └─ Logs: "Sandbox: deny file-write-data /etc/passwd (msg _xxx_SBX)"   │
│                                                                              │
│  startLogMonitor (UZ7) captures log                                         │
│       │                                                                      │
│       ├─ Filters by SANDBOX_LOG_TAG                                         │
│       ├─ Parses violation message                                           │
│       ├─ Decodes command from CMD64_..._END                                 │
│       └─ Filters benign violations (mDNSResponder, etc.)                    │
│                                                                              │
│  SandboxViolationStore.addViolation()                                       │
│       │                                                                      │
│       ├─ Add to ring buffer (max 100)                                       │
│       └─ notifyListeners()                                                  │
│                                                                              │
│  SandboxViolationStatusLine (aIq) receives update                           │
│       │                                                                      │
│       ├─ Calculate delta: currentTotal - lastSeenTotal                      │
│       ├─ If delta > 0:                                                      │
│       │    • setCount(delta)                                                │
│       │    • Start/reset 5s timer → setCount(0)                             │
│       │    • Re-render with new count                                       │
│       │                                                                      │
│       └─ If delta === 0: no change                                          │
│                                                                              │
│  Status line displays:                                                       │
│       │                                                                      │
│       └─ "⧈ Sandbox blocked N operations · ctrl+o for details · /sandbox"   │
│                                                                              │
│  After 5 seconds idle                                                        │
│       │                                                                      │
│       └─ Timer fires → setCount(0) → status line hidden                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 16. SandboxViolationStatusLine Complete Code

**Location:** `chunks.191.mjs:92-127`

```javascript
// ============================================
// SandboxViolationStatusLine - Status bar flash on new violations (macOS)
// Location: chunks.191.mjs:92-127
// ============================================

// ORIGINAL (for source lookup):
function aIq() {
    let A = A6(6),
        [q, K] = RV6.useState(0),
        Y = RV6.useRef(null),
        z = Rq("app:toggleTranscript", "Global", "ctrl+o"),
        _, w;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) _ = () => {
        if (!vA.isSandboxingEnabled()) return;
        let H = vA.getSandboxViolationStore(),
            j = H.getTotalCount(),
            J = H.subscribe(() => {
                let M = H.getTotalCount(),
                    D = M - j;
                if (D > 0) {
                    if (K(D), j = M, Y.current) clearTimeout(Y.current);
                    Y.current = setTimeout(K, 5000, 0)
                }
            });
        return () => {
            if (J(), Y.current) clearTimeout(Y.current)
        }
    }, w = [], A[0] = _, A[1] = w;
    else _ = A[0], w = A[1];
    if (RV6.useEffect(_, w), !vA.isSandboxingEnabled() || q === 0) return null;
    let O = q === 1 ? "operation" : "operations",
        $;
    if (A[2] !== z || A[3] !== q || A[4] !== O) $ = va6.createElement(m, {
        paddingX: 0,
        paddingY: 0
    }, va6.createElement(T, {
        color: "inactive",
        wrap: "truncate"
    }, "⧈ Sandbox blocked ", q, " ", O, " ·", " ", z, " for details · /sandbox to disable")), A[2] = z, A[3] = q, A[4] = O, A[5] = $;
    else $ = A[5];
    return $
}

// READABLE (for understanding):
function SandboxViolationStatusLine() {
    // React hooks for memoization cache
    let cache = useMemoCache(6);

    // State: count of new violations since last reset
    let [count, setCount] = useState(0);

    // Ref: timer for auto-dismiss
    let timerRef = useRef(null);

    // Keybinding for toggle transcript (ctrl+o)
    let toggleKey = getKeybinding("app:toggleTranscript", "Global", "ctrl+o");

    // Effect: Subscribe to violation store
    let setupEffect, deps;
    if (cache[0] === Symbol.for("react.memo_cache_sentinel")) {
        setupEffect = () => {
            // Skip if sandbox not enabled
            if (!vA.isSandboxingEnabled()) return;

            let store = vA.getSandboxViolationStore();
            let lastTotal = store.getTotalCount();

            // Subscribe to changes
            let unsubscribe = store.subscribe(() => {
                let currentTotal = store.getTotalCount();
                let delta = currentTotal - lastTotal;

                if (delta > 0) {
                    // New violations detected
                    setCount(delta);
                    lastTotal = currentTotal;

                    // Reset timer
                    if (timerRef.current) {
                        clearTimeout(timerRef.current);
                    }

                    // Auto-dismiss after 5 seconds
                    timerRef.current = setTimeout(setCount, 5000, 0);
                }
            });

            // Cleanup
            return () => {
                unsubscribe();
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                }
            };
        };
        deps = [];
        cache[0] = setupEffect;
        cache[1] = deps;
    } else {
        setupEffect = cache[0];
        deps = cache[1];
    }

    useEffect(setupEffect, deps);

    // Don't render if sandbox disabled or no new violations
    if (!vA.isSandboxingEnabled() || count === 0) {
        return null;
    }

    // Pluralize
    let operationWord = count === 1 ? "operation" : "operations";

    // Render status line
    return (
        <Box paddingX={0} paddingY={0}>
            <Text color="inactive" wrap="truncate">
                ⧈ Sandbox blocked {count} {operationWord} · {toggleKey} for details · /sandbox to disable
            </Text>
        </Box>
    );
}

// Mapping: aIq→SandboxViolationStatusLine, RV6→React, K→setCount, Y→timerRef,
//          vA→sandboxConfigObject, z→toggleKey, q→count, va6→React, m→Box, T→Text
```

### Key Implementation Details

**Why `getTotalCount()` vs `getCount()`:**
- `getTotalCount()` never resets - tracks lifetime violations
- `getCount()` is current buffer size (max 100)
- Delta calculation uses total to detect new violations

**Why 5-second timer:**
- Long enough for user to notice
- Short enough to not clutter status bar
- Resets on each new violation (cumulative awareness)

**Why subscribe in effect:**
- Subscription created on mount
- Cleanup on unmount
- No memory leaks from orphaned subscriptions

---

## 17. Keyboard Navigation and Tab Panel Structure

### Tab Panel Navigation

The `/sandbox` command uses a `TabPanel` component with keyboard navigation:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Sandbox Tab Panel Structure                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Tab Bar: [Mode] [Overrides] [Status] [Dependencies]                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Keyboard Navigation:                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • Tab / Shift+Tab   → Cycle between tabs                            │    │
│  │ • Enter            → Select current option                          │    │
│  │ • Escape           → Cancel and close                               │    │
│  │ • Arrow Up/Down    → Navigate within options                        │    │
│  │ • ctrl+c           → Cancel (fires "confirm:no" keybinding)         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Tab Visibility:                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ • "Mode" tab          → Always visible                              │    │
│  │ • "Overrides" tab     → Always visible (if not locked by policy)    │    │
│  │ • "Status" tab        → Always visible                              │    │
│  │ • "Dependencies" tab  → Visible only if warnings.length > 0         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tab Content Components

#### Mode Tab (SandboxModeSelector - TPq)

```javascript
// ============================================
// Mode Tab - 3-way sandbox mode picker
// Location: chunks.165.mjs:1737-1870
// ============================================

// Options rendered:
// 1. "Sandbox BashTool, with auto-allow" - enabled + autoAllowBashIfSandboxed
// 2. "Sandbox BashTool, with regular permissions" - enabled + !autoAllow
// 3. "No Sandbox" - !enabled

// Selection handler:
async function handleModeChange(selection) {
    switch (selection) {
        case "auto-allow":
            await vA.setSandboxSettings({ enabled: true, autoAllowBashIfSandboxed: true });
            onComplete("✓ Sandbox enabled with auto-allow for bash commands");
            break;
        case "regular":
            await vA.setSandboxSettings({ enabled: true, autoAllowBashIfSandboxed: false });
            onComplete("✓ Sandbox enabled with regular bash permissions");
            break;
        case "disabled":
            await vA.setSandboxSettings({ enabled: false, autoAllowBashIfSandboxed: false });
            onComplete("○ Sandbox disabled");
            break;
    }
}
```

#### Overrides Tab (SandboxOverridesSettings - ZPq)

```javascript
// ============================================
// Overrides Tab - Open/Closed policy toggle
// Location: chunks.165.mjs:1505-1639
// ============================================

// Options rendered:
// 1. "Allow unsandboxed fallback" - areUnsandboxedCommandsAllowed = true
// 2. "Strict sandbox mode" - areUnsandboxedCommandsAllowed = false

// Selection handler:
async function handleOverrideChange(selection) {
    await vA.setSandboxSettings({
        allowUnsandboxedCommands: selection === "open"
    });
    onComplete(selection === "open"
        ? "✓ Fallback allowed"
        : "✓ Strict sandbox mode enabled");
}

// Description text:
// "When a command fails due to sandbox restrictions, Claude can retry with
//  dangerouslyDisableSandbox to run outside the sandbox (falling back to
//  default permissions)."
```

#### Dependencies Tab (SandboxDependenciesPanel - Ql8)

```javascript
// ============================================
// Dependencies Tab - Show missing binaries
// Location: chunks.165.mjs:1641-1728
// ============================================

// Only shown if checkDependencies().warnings.length > 0

// Linux warnings:
// - "Cannot block unix domain sockets (seccomp binaries not found)"
// - "bwrap not found in PATH"
// - "socat not found in PATH"

// Warning item component:
function WarningItem({ message }, index) {
    return <Text key={index} dimColor>{message}</Text>;
}
```

---

## 18. Error State Handling

### Platform Not Supported

```javascript
// Displayed when isSupportedPlatform() returns false
if (!vA.isSupportedPlatform()) {
    let msg = platform === "wsl"
        ? "Error: Sandboxing requires WSL2."
        : "Error: Only macOS, Linux, and WSL2 supported.";
    return colorize("error", theme)(msg);
}
```

### Dependencies Missing

```javascript
// Displayed when checkDependencies().errors.length > 0
let depCheck = vA.checkDependencies();
if (depCheck.errors.length > 0) {
    // Shows error icon (⚠) in slash command description
    // Example errors:
    // - "ripgrep (rg) not found"
    // - "bwrap not found"
    // - "socat not found"
}
```

### Settings Locked by Policy

```javascript
// Displayed when areSandboxSettingsLockedByPolicy() returns true
if (vA.areSandboxSettingsLockedByPolicy()) {
    return colorize("error", theme)(
        "Error: Settings locked by higher-priority config."
    );
}
```

### Platform Not in Enabled List

```javascript
// Displayed when isPlatformInEnabledList() returns false
if (!vA.isPlatformInEnabledList()) {
    return colorize("error", theme)(
        `Error: Disabled for platform ${platform} via enabledPlatforms`
    );
}
```

---

## 19. Complete UI State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     /sandbox Command State Machine                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Initial State                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ User types: /sandbox                                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ▼                                                                      │
│  Platform Check                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ isSupportedPlatform()?                                               │    │
│  │   ├─ No (WSL1)   → Error: "Sandboxing requires WSL2"                │    │
│  │   ├─ No (other)  → Error: "Only macOS, Linux, WSL2 supported"       │    │
│  │   └─ Yes        → Continue                                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ▼                                                                      │
│  Platform Enabled Check                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ isPlatformInEnabledList()?                                           │    │
│  │   ├─ No  → Error: "Disabled for platform X via enabledPlatforms"    │    │
│  │   └─ Yes → Continue                                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ▼                                                                      │
│  Policy Lock Check                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ areSandboxSettingsLockedByPolicy()?                                  │    │
│  │   ├─ Yes → Error: "Settings locked by higher-priority config"       │    │
│  │   └─ No  → Continue                                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ▼                                                                      │
│  Argument Parsing                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Has subcommand?                                                      │    │
│  │   ├─ "exclude <pattern>" → Add to excludedCommands                  │    │
│  │   ├─ Unknown subcommand → Error: "Unknown subcommand"               │    │
│  │   └─ No subcommand      → Show TabPanel UI                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ▼                                                                      │
│  Interactive UI                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ TabPanel with:                                                       │    │
│  │   • Mode tab (always)                                                │    │
│  │   • Overrides tab (if not locked)                                    │    │
│  │   • Status tab (always)                                              │    │
│  │   • Dependencies tab (if warnings)                                   │    │
│  │                                                                      │    │
│  │ User selects option → setSandboxSettings() called                   │    │
│  │ Settings saved to .claude/settings.local.json                       │    │
│  │ onComplete() called with success message                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Related Documents

- [overview.md](./overview.md) - Sandbox architecture overview
- [seatbelt_profile.md](./seatbelt_profile.md) - macOS sandbox-exec implementation
- [bwrap_implementation.md](./bwrap_implementation.md) - Linux bubblewrap implementation
- [violation_system.md](./violation_system.md) - Violation correlation and reporting
- [initialization_flow.md](./initialization_flow.md) - Sandbox bootstrap sequence

---

## 20. Complete Interaction Flow Diagrams

### Flow 1: Enabling Sandbox with Auto-Allow

```
User                        Claude Code UI                  Settings Store
│                                │                                │
│  Types: /sandbox               │                                │
│ ──────────────────────────────>│                                │
│                                │                                │
│                                │ Check isSupportedPlatform()    │
│                                │────────────────────>           │
│                                │                                │
│                                │ Check checkDependencies()      │
│                                │────────────────────>           │
│                                │                                │
│                                │ Show TabPanel UI               │
│                                │ [Mode] [Overrides] [Config]    │
│                                │                                │
│  Selects: "Sandbox BashTool,   │                                │
│           with auto-allow"     │                                │
│ ──────────────────────────────>│                                │
│                                │                                │
│                                │ setSandboxSettings({           │
│                                │   enabled: true,               │
│                                │   autoAllowBashIfSandboxed:true│
│                                │ })                             │
│                                │────────────────────────────────>│
│                                │                                │
│                                │        Write to localSettings  │
│                                │        { "sandbox": {          │
│                                │          "enabled": true,      │
│                                │          "autoAllowBashIfSandboxed": true
│                                │        }}                      │
│                                │                                │
│                                │ Settings change triggers       │
│                                │ sandboxConfigObject.updateConfig()
│                                │                                │
│  Sees: "✓ Sandbox enabled with │                                │
│         auto-allow for bash    │                                │
│         commands"              │                                │
│ <──────────────────────────────│                                │
│                                │                                │
```

### Flow 2: Adding Command Exclusion

```
User                        Claude Code UI                  Settings Store
│                                │                                │
│  Types: /sandbox exclude       │                                │
│         "npm run test:*"       │                                │
│ ──────────────────────────────>│                                │
│                                │                                │
│                                │ Parse subcommand: "exclude"    │
│                                │ Extract pattern: "npm run test:*"
│                                │ Strip quotes                   │
│                                │                                │
│                                │ Add to excludedCommands array  │
│                                │────────────────────────────────>│
│                                │                                │
│                                │        Update localSettings:   │
│                                │        { "sandbox": {          │
│                                │          "excludedCommands": [ │
│                                │            "npm run test:*"    │
│                                │          ]                     │
│                                │        }}                      │
│                                │                                │
│  Sees: 'Added "npm run test:*" │                                │
│         to excluded commands   │                                │
│         in .claude/            │                                │
│         settings.local.json'   │                                │
│ <──────────────────────────────│                                │
│                                │                                │
```

### Flow 3: Detecting Sandbox Violation (macOS)

```
Sandboxed Command          macOS Kernel             Log Monitor          Violation Store
│                              │                         │                      │
│  Attempt to read /etc/passwd │                         │                      │
│ ────────────────────────────>│                         │                      │
│                              │                         │                      │
│                              │ Deny access             │                      │
│                              │ Generate log:           │                      │
│                              │ "Sandbox: file-read*    │                      │
│                              │  /etc/passwd"           │                      │
│                              │─────────────────────────>│                      │
│                              │                         │                      │
│                              │                         │ Parse log line       │
│                              │                         │ Extract command from │
│                              │                         │ CMD64_xxx_END tag    │
│                              │                         │                      │
│                              │                         │ Filter mDNSResponder │
│                              │                         │ (ignored)            │
│                              │                         │                      │
│                              │                         │ addViolation({       │
│                              │                         │   line: "file-read* │
│                              │                         │     /etc/passwd",    │
│                              │                         │   command: "cat...", │
│                              │                         │   timestamp: Date    │
│                              │                         │ })───────────────────>│
│                              │                         │                      │
│                              │                         │                      │
│  Command fails with EPERM    │                         │ notifyListeners()    │
│ <────────────────────────────│                         │──────────────────────>│
│                              │                         │                      │
│                              │                         │                      │
│                                                                       │
│                         StatusLine subscribes to ViolationStore       │
│                         Shows "⚠ 1 sandbox violation" for 5 seconds   │
│                                                                       │
```

### Flow 4: Permission Prompt for Unsandboxed Command

```
Model                      Bash Tool                  Permission System        User
│                              │                            │                   │
│  Calls Bash with             │                            │                   │
│  dangerouslyDisableSandbox   │                            │                   │
│ ────────────────────────────>│                            │                   │
│                              │                            │                   │
│                              │ isCommandSandboxed()?      │                   │
│                              │ Returns false (override)   │                   │
│                              │                            │                   │
│                              │ Check permission rules     │                   │
│                              │────────────────────────────>│                   │
│                              │                            │                   │
│                              │ No matching rule           │                   │
│                              │ Show permission prompt     │                   │
│                              │ Title: "Bash command       │                   │
│                              │        (unsandboxed)"      │                   │
│                              │────────────────────────────────────────────────>│
│                              │                            │                   │
│                              │                            │  User approves    │
│                              │                            │ <─────────────────│
│                              │                            │                   │
│                              │ Return "allow" decision    │                   │
│                              │<────────────────────────────│                   │
│                              │                            │                   │
│                              │ Execute command UNSANDBOXED│                   │
│                              │                            │                   │
│  Receives command output     │                            │                   │
│ <────────────────────────────│                            │                   │
│                              │                            │                   │
```

---

## 19. CLI Flags: --sandbox and --no-sandbox

### Command Line Override

**Location:** `chunks.178.mjs:2085-2133`

```javascript
// ============================================
// CLI flag handling for sandbox
// Location: chunks.178.mjs:2085-2133
// ============================================

// ORIGINAL (for source lookup):
else if (P === "--sandbox") K = !0;
else if (P === "--no-sandbox") K = !1;

// ... later in initialization:
sandbox: K,
// passed to settings initialization

// READABLE (for understanding):
// During CLI argument parsing:
if (arg === "--sandbox") {
    sandboxEnabled = true;  // Force enable
} else if (arg === "--no-sandbox") {
    sandboxEnabled = false; // Force disable
}

// The value is passed to settings initialization:
initializeSettings({
    sandbox: sandboxEnabled,
    // ... other settings
});
```

### CLI Flag Behavior

| Flag | Effect | Priority |
|------|--------|----------|
| `--sandbox` | Forces sandbox enabled | Overrides settings file |
| `--no-sandbox` | Forces sandbox disabled | Overrides settings file |
| (no flag) | Uses `settings.sandbox.enabled` | Normal behavior |

**Key insight:** CLI flags override settings file configuration. This is useful for:
1. Testing: Run single commands with/without sandbox
2. Debugging: Temporarily disable sandbox without editing settings
3. CI/CD: Control sandbox behavior in automated environments

### Example Usage

```bash
# Force sandbox on for this session
claude --sandbox

# Force sandbox off for this session
claude --no-sandbox

# Normal behavior (uses settings)
claude
```

---

## 20. Telemetry Integration

### Sandbox Telemetry Fields

**Location:** `chunks.197.mjs:1819-1821`

```javascript
// ============================================
// Sandbox telemetry fields
// Location: chunks.197.mjs:1819-1821
// ============================================

// ORIGINAL (for source lookup):
sandbox_enabled: vA.isSandboxingEnabled(),
are_unsandboxed_commands_allowed: vA.areUnsandboxedCommandsAllowed(),
is_auto_bash_allowed_if_sandbox_enabled: vA.isAutoAllowBashIfSandboxedEnabled()

// READABLE (for understanding):
// Telemetry event includes:
{
    sandbox_enabled: sandboxConfigObject.isSandboxingEnabled(),
    are_unsandboxed_commands_allowed: sandboxConfigObject.areUnsandboxedCommandsAllowed(),
    is_auto_bash_allowed_if_sandbox_enabled: sandboxConfigObject.isAutoAllowBashIfSandboxedEnabled()
}
```

### What Gets Tracked

| Field | Source | Purpose |
|-------|--------|---------|
| `sandbox_enabled` | `isSandboxingEnabled()` | Whether sandbox is fully operational |
| `are_unsandboxed_commands_allowed` | `areUnsandboxedCommandsAllowed()` | Whether fallback is permitted |
| `is_auto_bash_allowed_if_sandbox_enabled` | `isAutoAllowBashIfSandboxedEnabled()` | Auto-allow mode status |

### Telemetry Events

The sandbox telemetry is sent with:
1. Session start events
2. Tool usage events (when Bash tool is invoked)
3. Error events (when sandbox-related failures occur)

**Privacy note:** No sandbox configuration details (paths, domains, etc.) are included in telemetry - only the boolean status flags.

---

## 21. Complete UI Component Lifecycle Summary

### /sandbox Slash Command Flow

```
User types /sandbox
    │
    ▼
bAz.description getter (computed live)
    │
    ├─► Shows status: "✓ sandbox enabled (auto-allow)" or "○ sandbox disabled"
    │
    └─► Shows warnings: "⚠" if dependencies missing
    │
    ▼
User presses Enter
    │
    ▼
bAz.load() → imports and renders TPq (SandboxModeSelector)
    │
    ▼
TPq renders with tabs:
    │
    ├─► [Mode] tab
    │     └─► SelectInput with options:
    │           - "Sandbox BashTool, with auto-allow" (current)
    │           - "Sandbox BashTool, with regular permissions"
    │           - "No Sandbox"
    │
    ├─► [Overrides] tab (ZPq)
    │     └─► SelectInput with options:
    │           - "Allow unsandboxed fallback" (open mode)
    │           - "Strict sandbox mode" (closed mode)
    │
    ├─► [Status] tab (PPq)
    │     └─► Box with current config:
    │           - Excluded commands
    │           - Filesystem read restrictions
    │           - Filesystem write restrictions
    │           - Network restrictions
    │           - Unix socket allowlist
    │           - Glob pattern warnings (Linux)
    │
    └─► [Dependencies] tab (Ql8) - only if warnings
          └─► Box with status:
                - bubblewrap (bwrap): installed/not installed
                - socat: installed/not installed
                - seccomp filter: installed/not installed
    │
    ▼
User selects an option
    │
    ▼
vA.setSandboxSettings({enabled, autoAllowBashIfSandboxed, ...})
    │
    ▼
Writes to .claude/settings.local.json
    │
    ▼
Settings change event triggers
    │
    ▼
Sandbox config refreshes (live update)
    │
    ▼
onComplete("✓ Sandbox enabled with auto-allow")
```

### Violation Status Line Lifecycle

```
SandboxViolationStore (HD6) initialized
    │
    ▼
aIq component mounts
    │
    ├─► useEffect runs on mount
    │     │
    │     └─► Subscribes to HD6
    │           │
    │           └─► Returns unsubscribe function for cleanup
    │
    ▼
User runs sandboxed command
    │
    ▼
Command triggers violation (e.g., writes to denied path)
    │
    ▼
macOS log monitor (UZ7) detects deny event
    │
    ▼
HD6.addViolation(violation)
    │
    ├─► Pushes to violations array
    ├─► Increments totalCount
    ├─► Trims if > 100 (ring buffer)
    └─► Calls notifyListeners()
    │
    ▼
aIq subscription callback fires
    │
    ├─► Computes delta: totalCount - lastKnownCount
    │
    ├─► If delta > 0:
    │     ├─► setNewViolationCount(delta)
    │     ├─► lastKnownCount = totalCount
    │     └─► setTimeout(() => setNewViolationCount(0), 5000)
    │
    ▼
Component re-renders with message:
"⧈ Sandbox blocked N operations · ctrl+o for details · /sandbox to disable"
    │
    ▼
After 5 seconds (or new violation):
    │
    └─► setNewViolationCount(0) → returns null (hidden)
```

### Permission Prompt Variation Flow

```
Bash tool invoked
    │
    ▼
Check isCommandSandboxed(toolInput)
    │
    ├─► Returns true (command will be sandboxed)
    │     │
    │     └─► Check autoAllowBashIfSandboxed
    │           │
    │           ├─► true → Auto-allow (no prompt)
    │           │
    │           └─► false → Show permission prompt
    │                 │
    │                 └─► Title: "Bash command"
    │
    └─► Returns false (command will NOT be sandboxed)
          │
          └─► Show permission prompt
                │
                └─► Title: "Bash command (unsandboxed)"
                      │
                      └─► decisionReason.type: "sandboxOverride"
                            │
                            └─► Description: "Run outside of the sandbox"
```

---

## Related Documents

- [overview.md](./overview.md) - Sandbox architecture overview
- [cross_module_integration.md](./cross_module_integration.md) - Cross-module integration
- [symbol_validation.md](./symbol_validation.md) - Symbol validation report

---

## 8. TabPanel Component (Hw)

### Component Structure

The sandbox UI uses a tab-based interface managed by the `TabPanel` component (Hw).

```javascript
// ============================================
// TabPanel - Tab container for sandbox UI
// Location: chunks.165.mjs (referenced in TPq)
// ============================================

// READABLE (for understanding):
function TabPanel({ title, children }) {
    return (
        <Box flexDirection="column">
            <Text bold color="primary">{title}</Text>
            <Box flexDirection="column" paddingY={1}>
                {children}
            </Box>
        </Box>
    );
}

// Usage in SandboxModeSelector:
<TabPanel key="mode" title="Mode">
    {/* Mode selection content */}
</TabPanel>
<TabPanel key="overrides" title="Overrides">
    <SandboxOverridesSettings onComplete={onComplete} />
</TabPanel>
<TabPanel key="config" title="Config">
    <SandboxStatusDisplay />
</TabPanel>
{hasErrors && (
    <TabPanel key="dependencies" title="Dependencies">
        <SandboxDependenciesPanel depCheck={depCheck} />
    </TabPanel>
)}
```

---

## 9. SelectInput Integration

### 3-Way Mode Selector

```javascript
// ============================================
// SelectInput - Mode selection component
// Location: chunks.165.mjs (T8 component)
// ============================================

// READABLE (for understanding):
function SelectInput({ options, onChange, onCancel }) {
    // options: Array<{ label: string, value: string }>
    // onChange: (value: string) => void
    // onCancel: () => void

    // Keyboard bindings:
    // - Up/Down: Navigate options
    // - Enter: Select option
    // - Escape: Cancel (calls onCancel)

    return (
        <Box flexDirection="column">
            {options.map((option, index) => (
                <Text
                    key={option.value}
                    color={selectedIndex === index ? "selected" : "default"}
                >
                    {selectedIndex === index ? "❯ " : "  "}
                    {option.label}
                </Text>
            ))}
        </Box>
    );
}
```

---

## 10. Doctor Command Integration

### Sandbox Dependency Check in /doctor

The `/doctor` command shows sandbox dependency status:

```javascript
// In doctor command implementation
async function checkSandboxDependencies() {
    let depCheck = vA.checkDependencies();

    results.push({
        category: "Sandbox",
        items: [
            {
                name: "Platform Support",
                status: vA.isSupportedPlatform() ? "ok" : "warn",
                message: vA.isSupportedPlatform()
                    ? getPlatform()
                    : "Sandbox not supported on this platform"
            },
            {
                name: "bwrap (bubblewrap)",
                status: depCheck.errors.some(e => e.includes("bwrap")) ? "error" : "ok",
                message: depCheck.errors.some(e => e.includes("bwrap"))
                    ? "Not installed - apt install bubblewrap"
                    : "Installed"
            },
            {
                name: "socat",
                status: depCheck.errors.some(e => e.includes("socat")) ? "error" : "ok",
                message: depCheck.errors.some(e => e.includes("socat"))
                    ? "Not installed - apt install socat"
                    : "Installed"
            },
            {
                name: "seccomp filter",
                status: depCheck.warnings.length > 0 ? "warn" : "ok",
                message: depCheck.warnings.length > 0
                    ? "Not installed - Unix socket blocking disabled"
                    : "Installed"
            }
        ]
    });
}
```

---

## 11. Complete UI State Machine

### Sandbox Mode States

```
┌─────────────────────────────────────────────────────────────────┐
│                     SANDBOX MODE STATE MACHINE                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  States:                                                         │
│  ┌─────────────┐                                                 │
│  │ DISABLED    │  enabled: false, autoAllow: false              │
│  └─────────────┘                                                 │
│        │                                                         │
│        │ user enables sandbox                                    │
│        ▼                                                         │
│  ┌─────────────┐                                                 │
│  │ REGULAR     │  enabled: true, autoAllow: false               │
│  └─────────────┘                                                 │
│        │                                                         │
│        │ user enables auto-allow                                 │
│        ▼                                                         │
│  ┌─────────────┐                                                 │
│  │ AUTO_ALLOW  │  enabled: true, autoAllow: true                │
│  └─────────────┘                                                 │
│        │                                                         │
│        │ user disables sandbox OR disables auto-allow            │
│        │                                                         │
│        └──────────────► returns to appropriate state             │
│                                                                  │
│  Override Policy:                                                │
│  ┌─────────────┐                                                 │
│  │ OPEN        │  allowUnsandboxedCommands: true                │
│  │             │  → dangerouslyDisableSandbox allowed           │
│  └─────────────┘                                                 │
│        │                                                         │
│        │ user sets strict mode                                   │
│        ▼                                                         │
│  ┌─────────────┐                                                 │
│  │ CLOSED      │  allowUnsandboxedCommands: false               │
│  │             │  → dangerouslyDisableSandbox ignored           │
│  └─────────────┘                                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### State Transitions

| Current State | Action | New State | Settings Change |
|---------------|--------|-----------|-----------------|
| DISABLED | Select "auto-allow" | AUTO_ALLOW | `{enabled: true, autoAllow: true}` |
| DISABLED | Select "regular" | REGULAR | `{enabled: true, autoAllow: false}` |
| REGULAR | Select "auto-allow" | AUTO_ALLOW | `{autoAllow: true}` |
| REGULAR | Select "disabled" | DISABLED | `{enabled: false}` |
| AUTO_ALLOW | Select "regular" | REGULAR | `{autoAllow: false}` |
| AUTO_ALLOW | Select "disabled" | DISABLED | `{enabled: false}` |
| OPEN | Select "strict" | CLOSED | `{allowUnsandboxedCommands: false}` |
| CLOSED | Select "allow fallback" | OPEN | `{allowUnsandboxedCommands: true}` |

---

## 12. State Management Deep Dive

### Settings Reactivity Pattern

The sandbox UI uses a publish-subscribe pattern to react to settings changes:

```javascript
// ============================================
// Settings subscription pattern
// Location: chunks.47.mjs (initializeSandboxFromSettings)
// ============================================

// READABLE (for understanding):
async function initializeSandboxFromSettings(networkPermissionCallback) {
    if (sandboxInitPromise) return sandboxInitPromise;
    if (!vA.isSandboxingEnabled()) return;

    let settings = getSettings();
    let config = buildSandboxConfigFromSettings(settings);

    sandboxInitPromise = (async () => {
        try {
            await lowLevelSandbox.initialize(config, networkPermissionCallback);

            // Subscribe to settings changes - auto-update sandbox config
            settingsUnsubscribe = subscribeToSettings(() => {
                let newSettings = getSettings();
                let newConfig = buildSandboxConfigFromSettings(newSettings);
                lowLevelSandbox.updateConfig(newConfig);
                log("Sandbox configuration updated from settings change");
            });
        } catch (error) {
            sandboxInitPromise = undefined;
            log(`Failed to initialize sandbox: ${error.message}`);
        }
    })();

    return sandboxInitPromise;
}
```

**Key insight:** The `subscribeToSettings` callback ensures that:
1. When user modifies `.claude/settings.json` manually
2. When `/sandbox` command updates settings
3. When enterprise policy changes are detected

The sandbox configuration updates immediately without requiring a restart.

### Observer Pattern for Violations

The `SandboxViolationStore` (HD6) implements the observer pattern:

```javascript
// ============================================
// Observer pattern implementation
// Location: chunks.55.mjs:2902-2936
// ============================================

class SandboxViolationStore {
    constructor() {
        this.violations = [];
        this.totalCount = 0;
        this.maxSize = 100;
        this.listeners = new Set();  // Observer callbacks
    }

    // Add observer
    subscribe(callback) {
        this.listeners.add(callback);
        callback(this.getViolations());  // Initial call with current state
        return () => { this.listeners.delete(callback); };  // Unsubscribe function
    }

    // Notify all observers
    notifyListeners() {
        let currentViolations = this.getViolations();
        this.listeners.forEach(callback => callback(currentViolations));
    }
}
```

**Usage in UI components:**

```javascript
// ============================================
// Component subscription to violation store
// Location: chunks.191.mjs:92-127 (SandboxViolationStatusLine)
// ============================================

function SandboxViolationStatusLine() {
    let [newViolationCount, setNewViolationCount] = useState(0);
    let timeoutRef = useRef(null);

    useEffect(() => {
        if (!vA.isSandboxingEnabled()) return;

        let store = vA.getSandboxViolationStore();
        let lastKnownCount = store.getTotalCount();

        // Subscribe to violation updates
        let unsubscribe = store.subscribe(() => {
            let currentCount = store.getTotalCount();
            let delta = currentCount - lastKnownCount;

            if (delta > 0) {
                setNewViolationCount(delta);  // Update UI
                lastKnownCount = currentCount;
                clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => setNewViolationCount(0), 5000);
            }
        });

        // Cleanup on unmount
        return () => {
            unsubscribe();
            clearTimeout(timeoutRef.current);
        };
    }, []);

    if (!vA.isSandboxingEnabled() || newViolationCount === 0) return null;

    return `⧈ Sandbox blocked ${newViolationCount} operations`;
}
```

### Error Handling UI

#### Platform Not Supported

```javascript
// Location: chunks.165.mjs:1946-1957

function handlePlatformError(renderResult, theme) {
    let platform = getPlatform();

    if (platform === "wsl") {
        return renderResult(colorize("error", theme)(
            "Error: Sandboxing requires WSL2. WSL1 is not supported."
        ));
    }

    return renderResult(colorize("error", theme)(
        `Error: Sandboxing is currently only supported on macOS, Linux, and WSL2.`
    ));
}
```

#### Dependency Missing

```javascript
// Location: chunks.165.mjs:1641-1725 (SandboxDependenciesPanel)

function SandboxDependenciesPanel({ depCheck }) {
    let bwrapMissing = depCheck.errors.some(e => e.includes("bwrap"));
    let socatMissing = depCheck.errors.some(e => e.includes("socat"));
    let seccompMissing = depCheck.warnings.length > 0;

    return (
        <Box flexDirection="column">
            {/* bwrap status */}
            <Text>bubblewrap (bwrap): {bwrapMissing ?
                <Text color="error">not installed</Text> :
                <Text color="success">installed</Text>}
            </Text>
            {bwrapMissing && <Text dimColor>  · apt install bubblewrap</Text>}

            {/* socat status */}
            <Text>socat: {socatMissing ?
                <Text color="error">not installed</Text> :
                <Text color="success">installed</Text>}
            </Text>
            {socatMissing && <Text dimColor>  · apt install socat</Text>}

            {/* seccomp status (optional) */}
            <Text>seccomp filter: {seccompMissing ?
                <Text color="warning">not installed</Text> :
                <Text color="success">installed</Text>}
            </Text>
            {seccompMissing && (
                <Box flexDirection="column">
                    <Text dimColor>  · npm install -g @anthropic-ai/sandbox-runtime</Text>
                    <Text dimColor>  · or copy vendor/seccomp/* and set sandbox.seccomp paths</Text>
                </Box>
            )}
        </Box>
    );
}
```

#### Policy Locked State

```javascript
// Location: chunks.165.mjs:1957-1959

function handlePolicyLocked(renderResult, theme) {
    return renderResult(colorize("error", theme)(
        "Error: Sandbox settings are overridden by a higher-priority configuration " +
        "and cannot be changed locally."
    ));
}

// In SandboxOverridesSettings component
function SandboxOverridesSettings() {
    let isManaged = vA.areSandboxSettingsLockedByPolicy();

    if (isManaged) {
        return <Text color="subtle">
            Settings are managed by enterprise policy and cannot be changed.
        </Text>;
    }
    // ... normal settings UI
}
```

### Keyboard Navigation

| Key | Action | Context |
|-----|--------|---------|
| `Enter` | Execute /sandbox command | Command input |
| `↑`/`↓` | Navigate mode options | Mode selector |
| `Tab` | Switch tabs (Mode → Overrides → Status) | Tab panel |
| `Esc` | Dismiss sandbox panel | Any tab |
| `Ctrl+O` | Open transcript (view violations) | Status line |

---

## 13. Key Symbol Reference for UI

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `bAz` | sandboxSlashCommandDefinition | chunks.165.mjs:2007 | Slash command descriptor |
| `TPq` | SandboxModeSelector | chunks.165.mjs:1737 | Main mode selector |
| `PPq` | SandboxStatusDisplay | chunks.165.mjs:1399 | Config summary |
| `ZPq` | SandboxOverridesSettings | chunks.165.mjs:1505 | Override toggle |
| `Ql8` | SandboxDependenciesPanel | chunks.165.mjs:1641 | Dependency status |
| `aIq` | SandboxViolationStatusLine | chunks.191.mjs:92 | Status bar indicator |
| `vA` | sandboxConfigObject | chunks.56.mjs:516 | Public API |
| `HD6` | SandboxViolationStore | chunks.55.mjs:2902 | Violation ring buffer |
| `T8` | SelectInput | chunks.165.mjs | Radio-style selector |
| `Hw` | TabPanel | chunks.165.mjs | Tab container |
