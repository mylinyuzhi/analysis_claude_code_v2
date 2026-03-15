# Browser Control - UI Linkage Analysis (Claude Code 2.1.76)

> Analysis of all UI entry points, state management, React components,
> and settings integration for the "Claude in Chrome" feature.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions and components in this document:
- `ChromeOnboarding` (VKz) - React UI component for Chrome settings panel
- `chromeSettingsLoader` (LKz) - Async loader that pre-fetches state before rendering
- `chromeSettingsMeta` (RKz/UHq) - Slash command metadata object `{name: "chrome", ...}`
- `getMcpClients` (kKz) - State selector: `state.mcp.clients`
- `isChromeClientConnected` (EKz) - Filter: `client.name === "claude-in-chrome"`
- `CHROME_INSTALL_URL` (GKz) - `"https://claude.ai/chrome"`
- `CHROME_PERMISSIONS_URL` (ZKz) - `"https://clau.de/chrome/permissions"`
- `CHROME_RECONNECT_URL` (fKz/jKz) - `"https://clau.de/chrome/reconnect"`
- `stepIncrInstall` (vKz) - Step counter increment for "install extension"
- `stepIncrReconnect` (TKz) - Step counter increment for "reconnect"
- `stepIncrPermissions` (NKz) - Step counter increment for "manage permissions"
- `isSubscriberCheck` (i8) - Returns true if user has claude.ai subscription

---

## UI Entry Points

There are three ways the browser control UI surface appears:

```
┌──────────────────────────────────────────────────────────────┐
│  Entry Point 1: /chrome slash command                         │
│  → chromeSettingsMeta (RKz) → ChromeOnboarding (VKz)         │
├──────────────────────────────────────────────────────────────┤
│  Entry Point 2: /settings panel → "Claude in Chrome" item    │
│  → Same RKz metadata (visible in settings sidebar)           │
├──────────────────────────────────────────────────────────────┤
│  Entry Point 3: Agent loop - status bar / tool call output   │
│  → Chrome tools prefixed with mcp__claude-in-chrome__         │
│  → Connection status shown in MCP client list                 │
└──────────────────────────────────────────────────────────────┘
```

---

## Settings Command Registration

### `chromeSettingsMeta` (RKz/UHq)

```javascript
// ============================================
// chromeSettingsMeta - Settings panel registration
// Location: chunks.166.mjs:1741-1757
// ============================================

// ORIGINAL:
pHq = v(() => {
    B6();
    RKz = {
        name: "chrome",
        description: "Claude in Chrome (Beta) settings",
        isEnabled: () => !w4(),         // disabled in WSL
        isHidden: !1,
        type: "local-jsx",
        load: () => Promise.resolve().then(() => (gHq(), QHq)),
        userFacingName: () => "chrome"
    }, UHq = RKz
})

// READABLE:
chromeSettingsMeta = {
    name: "chrome",
    description: "Claude in Chrome (Beta) settings",
    isEnabled: () => !isWSL(),      // Chrome not supported on WSL
    isHidden: false,                // always visible in settings
    type: "local-jsx",              // renders React component
    load: () => Promise.resolve().then(() => {
        initChromeUiDeps();         // gHq: loads React, state hooks
        return CHROME_SETTINGS_MODULE;  // QHq = {}; ChromeOnboarding is set via LKz
    }),
    userFacingName: () => "chrome"
}
// Mapping: RKz/UHq→chromeSettingsMeta, B6→initDeps, w4→isWSL,
//   gHq→initChromeUiDeps, QHq→CHROME_SETTINGS_MODULE
```

**`type: "local-jsx"`:** Indicates the settings item renders a React/Ink JSX component
(as opposed to `type: "local"` which is text-only or `type: "prompt"` which calls the LLM).

**`isEnabled: () => !isWSL()`:** The Chrome integration is completely hidden on WSL because
native messaging is not supported in WSL environments.

---

## `chromeSettingsLoader` (LKz) — Pre-fetch State

```javascript
// ============================================
// chromeSettingsLoader - Async loader for ChromeOnboarding
// Location: chunks.166.mjs:1710-1723
// ============================================

// ORIGINAL:
LKz = async function(A) {
    u8("chrome");
    let q = await Ec(),
        K = f6(),
        Y = i8(),
        z = xA.isWslEnvironment();
    return sY.default.createElement(VKz, {
        onDone: A,
        isExtensionInstalled: q,
        configEnabled: K.claudeInChromeDefaultEnabled,
        isClaudeAISubscriber: Y,
        isWSL: z
    })
}

// READABLE:
chromeSettingsLoader = async function(onDone) {
    trackPageView("chrome");                          // analytics: user opened chrome settings

    // Pre-fetch all state before rendering
    let isExtensionInstalled = await detectChromeExtension();  // async disk scan
    let settings = getLocalSettings();
    let isSubscriber = isUserSubscriber();
    let isWSL = environment.isWslEnvironment();

    return React.createElement(ChromeOnboarding, {
        onDone,
        isExtensionInstalled,
        configEnabled: settings.claudeInChromeDefaultEnabled,
        isClaudeAISubscriber: isSubscriber,
        isWSL
    });
}
// Mapping: LKz→chromeSettingsLoader, u8→trackPageView, Ec→detectChromeExtension,
//   f6→getLocalSettings, i8→isUserSubscriber, xA.isWslEnvironment→isWslEnvironment
```

**Pre-fetch pattern:** The loader performs all I/O before rendering, passing results as props.
This avoids async loading states in the component itself.

---

## `ChromeOnboarding` Component (VKz)

Full anatomy of the Ink React component at `chunks.166.mjs:1515-1678`.

### Props Interface

```typescript
interface ChromeOnboardingProps {
    onDone: () => void;                    // Called when user exits the panel
    isExtensionInstalled: boolean;          // Initial value from async scan
    configEnabled: boolean | undefined;     // claudeInChromeDefaultEnabled setting
    isClaudeAISubscriber: boolean;          // User has claude.ai subscription
    isWSL: boolean;                         // Running under WSL
}
```

### Internal State

```javascript
// Location: chunks.166.mjs:1524-1528
let mcpClients = useSelector(getMcpClients);     // v6(kKz) - subscribe to MCP state
let [step, setStep] = useState(0);               // animation step counter
let [enabledDefault, setEnabledDefault] = useState(configEnabled ?? false);
let [openingBrowser, setOpeningBrowser] = useState(false);
let [extensionInstalled, setExtensionInstalled] = useState(isExtensionInstalled);
```

**MCP Connection Status:**
```javascript
// Find if the claude-in-chrome MCP client exists and is connected
let chromeClient = mcpClients.find(isChromeClientConnected);  // EKz: c.name === qy
let isConnected = chromeClient?.type === "connected";          // boolean
```

### Menu Options (Dynamic)

The menu adapts based on component state:

```javascript
// ============================================
// ChromeOnboarding menu option builder
// Location: chunks.166.mjs:1573-1615
// ============================================

let options = [];
let disabledNote = extensionInstalled ? "" : " (requires extension)";

// Option 1: Only shown when extension NOT installed and NOT WSL
if (!extensionInstalled && !isWSL) {
    options.push({ label: "Install Chrome extension", value: "install-extension" });
}

// Option 2: Manage permissions (grayed out if extension missing)
options.push({
    label: <><Text>Manage permissions</Text><Text dimColor>{disabledNote}</Text></>,
    value: "manage-permissions"
});

// Option 3: Reconnect extension (grayed out if extension missing)
options.push({
    label: <><Text>Reconnect extension</Text><Text dimColor>{disabledNote}</Text></>,
    value: "reconnect"
});

// Option 4: Toggle default enable/disable
options.push({
    label: `Enabled by default: ${enabledDefault ? "Yes" : "No"}`,
    value: "toggle-default"
});
```

### Action Handler

```javascript
// ============================================
// ChromeOnboarding action dispatcher
// Location: chunks.166.mjs:1545-1568
// ============================================

// ORIGINAL (switch statement):
case "install-extension":
    setStep(vKz); jA({openingBrowser: true}); openOrNavigate(GKz);  break;
case "reconnect":
    setStep(TKz); detectChromeExtension().then(installed => {
        setExtensionInstalled(installed);
        if (installed) setOpeningBrowser(false);
    }); openOrNavigate(fKz); break;
case "manage-permissions":
    setStep(NKz); openOrNavigate(ZKz); break;
case "toggle-default":
    let newVal = !enabledDefault;
    updateLocalSettings(prev => ({...prev, claudeInChromeDefaultEnabled: newVal}));
    setEnabledDefault(newVal);  break;

// READABLE:
function handleMenuAction(value) {
    switch (value) {
        case "install-extension":
            setStep(s => s + 1);           // Increment animation step
            setOpeningBrowser(true);        // Show "opening browser..." indicator
            openOrNavigate(CHROME_INSTALL_URL);   // Open https://claude.ai/chrome
            break;

        case "reconnect":
            setStep(s => s + 1);
            // Re-scan for extension asynchronously
            detectChromeExtension().then(installed => {
                setExtensionInstalled(installed);
                if (installed) setOpeningBrowser(false);  // Extension found: clear opening state
            });
            openOrNavigate(CHROME_RECONNECT_URL);  // Open https://clau.de/chrome/reconnect
            break;

        case "manage-permissions":
            setStep(s => s + 1);
            openOrNavigate(CHROME_PERMISSIONS_URL);  // Open https://clau.de/chrome/permissions
            break;

        case "toggle-default":
            let newVal = !enabledDefault;
            updateLocalSettings(prev => ({ ...prev, claudeInChromeDefaultEnabled: newVal }));
            setEnabledDefault(newVal);
            break;
    }
}
```

**`openOrNavigate` logic:**
```javascript
// In WSL: use openExternal (zY) to open via Windows host browser
// Otherwise: use jG6 (openBrowserToUrl) with platform-aware browser launch
let openOrNavigate = isWSL ? openExternal : openBrowserToUrl;
```

### Render Layout

```
┌─────────────────────────────────────────────────┐
│  Claude in Chrome (Beta)                    [Esc]│  ← w8 panel with title + onCancel
├─────────────────────────────────────────────────┤
│  Claude in Chrome works with the Chrome          │  ← description text (static)
│  extension to let you control your browser       │
│  directly from Claude Code...                    │
│                                                  │
│  [Error: Not supported in WSL]       ← if isWSL  │
│  [Error: Requires subscription]   ← if !subscriber│
│                                                  │
│  Status: ✓ Enabled / ✗ Disabled    ← if !G (not-WSL)│
│  Extension: ✓ Installed / ⚠ Not detected         │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │ › Install Chrome extension                │   │  ← kA SelectList
│  │   Manage permissions                      │   │
│  │   Reconnect extension                     │   │
│  │   Enabled by default: Yes/No              │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ⚠ Once installed, select "Reconnect extension"  │  ← if openingBrowser
│                                                  │
│  Usage: claude --chrome  or  claude --no-chrome  │
│  Site-level permissions managed in extension.    │
│                                                  │
│  Learn more: https://code.claude.com/docs/en/chrome│
└─────────────────────────────────────────────────┘
```

### Status Indicators

```javascript
// Status: Enabled/Disabled (based on MCP client connection)
if (isConnected)
    <Text color="success">Enabled</Text>    // green
else
    <Text color="inactive">Disabled</Text>  // gray

// Extension: Installed/Not detected
if (extensionInstalled)
    <Text color="success">Installed</Text>   // green
else
    <Text color="warning">Not detected</Text> // yellow
```

**`isConnected` is derived from MCP state**, not from a local variable. This means:
- The status automatically updates when the `claude-in-chrome` MCP server connects/disconnects
- The React component subscribes to `state.mcp.clients` via `useSelector(getMcpClients)`
- When Claude Code spawns the chrome MCP server, the client appears in state → component re-renders

---

## MCP Client Connection Status Integration

### State Selectors

```javascript
// ============================================
// getMcpClients / isChromeClientConnected
// Location: chunks.166.mjs:1696-1694
// ============================================

// ORIGINAL:
function kKz(A) { return A.mcp.clients }
function EKz(A) { return A.name === qy }

// READABLE:
function getMcpClients(state) {
    return state.mcp.clients;  // Array of { name, type, ... }
}

function isChromeClientConnected(client) {
    return client.name === "claude-in-chrome";  // qy constant
}
```

**Full integration chain:**
```
getChromeMcpConfig()              // HBA - returns mcpConfig with name "claude-in-chrome"
  ↓ Claude Code starts MCP server
state.mcp.clients                 // updated when MCP server connects
  ↓ React subscription
getMcpClients(kKz) → find(EKz)    // ChromeOnboarding reads connection status
  ↓ render
isConnected = client?.type === "connected"  // shown as Status: Enabled/Disabled
```

---

## WSL Guard Pattern

The WSL check appears at multiple levels, providing defense-in-depth:

```
Level 1: Feature gate (isClaudeInChromeEnabled/UN6)
  isWSL() && forcedValue !== true → return false
  → Chrome is never enabled in WSL by default

Level 2: Settings command visibility (chromeSettingsMeta.isEnabled)
  isEnabled: () => !isWSL()
  → /chrome command hidden in WSL

Level 3: ChromeOnboarding render
  let isBlocked = isWSL || !isSubscriber;
  → If blocked: render only error message, no menu
  → Error: "Claude in Chrome is not supported in WSL at this time."
```

---

## Subscription Gate

```javascript
// In ChromeOnboarding (VKz):
let isBlocked = isWSL || !isSubscriber;  // m variable

// If blocked: show error, hide menu
if (!isBlocked) {
    // Show Status + Extension status
    // Show SelectList menu
} else {
    // Only description + error messages shown
}
```

Error messages shown when blocked:
- WSL: `"Claude in Chrome is not supported in WSL at this time."` (color="error")
- No subscription: `"Claude in Chrome requires a claude.ai subscription."` (color="error")

---

## System Prompt Injection (`getChromeSystemPrompt` / YBA)

When Chrome integration is active, a detailed system prompt is injected via the MCP config's `systemPrompt` field. This gets added to the agent's system context.

The prompt covers 4 key sections (from `chunks.166.mjs:1175-1222`):

### 1. GIF Recording Guidelines
```
When performing multi-step browser interactions, use gif_creator.
ALWAYS:
- Capture extra frames before and after actions for smooth playback
- Name the file meaningfully (e.g., "login_process.gif")
```

### 2. Console Log Debugging
```
Use read_console_messages for console output.
Always use 'pattern' parameter with regex to filter.
Example: pattern: "[MyApp]" to filter app-specific logs.
```

### 3. Alerts and Dialog Avoidance
```
IMPORTANT: Do NOT trigger JavaScript alerts/confirms/prompts/dialogs.
These block browser events and prevent extension from receiving commands.
Instead: use console.log + read_console_messages.
If dialog triggered: inform user to manually dismiss.
```

### 4. Tab Session Management
```
CRITICAL: Call tabs_context_mcp first at start of each session.
Never reuse tab IDs from previous sessions.
Create new tab with tabs_create_mcp for each conversation.
If tab invalid: call tabs_context_mcp for fresh IDs.
```

**Why this system prompt is critical:** Browser automation is stateful and error-prone. These guidelines encode the failure modes discovered during development (dialog blocking, stale tab IDs, infinite retry loops) and teach the LLM how to avoid them.

---

## Briefing Text Variants

Two additional prompt fragments exist for different contexts:

### `CHROME_SKILL_BRIEF` (yHq) — Used when Chrome tools accessed without skill invoke
```
IMPORTANT: Before using any chrome browser tools, you MUST first load them using ToolSearch.

Chrome browser tools are MCP tools that require loading before use. Before calling any
mcp__claude-in-chrome__* tool:
1. Use ToolSearch with select:mcp__claude-in-chrome__<tool_name> to load the specific tool
2. Then call the tool
```

### `CHROME_SYSTEM_REMINDER` (zBA) — Added to system reminder when feature visible
```
**Browser Automation**: Chrome browser tools are available via the "claude-in-chrome" skill.
CRITICAL: Before using any mcp__claude-in-chrome__* tools, invoke the skill by calling the
Skill tool with skill: "claude-in-chrome". The skill provides browser automation instructions
and enables the tools.
```

**Key insight:** The LLM needs explicit instruction to invoke the skill before the tools become
available. Without this reminder, the LLM would attempt to call tools that haven't been loaded yet.

---

## Complete UI State Machine

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ChromeOnboarding State Machine                     │
│                                                                       │
│  Initial State:                                                       │
│    extensionInstalled = props.isExtensionInstalled                    │
│    enabledDefault     = props.configEnabled ?? false                  │
│    openingBrowser     = false                                         │
│    step               = 0                                             │
│    isConnected        = state.mcp.clients.find(name="claude-in-chrome")│
│                         ?.type === "connected"                        │
│                                                                       │
│  User actions:                                                        │
│                                                                       │
│  [install-extension] ─────────────────────────────────────────────┐  │
│    step++                                                          │  │
│    openingBrowser = true                                           │  │
│    open(https://claude.ai/chrome) ─────────────────────────────►  │  │
│                                                     Browser opens  │  │
│                                                                    │  │
│  [reconnect] ──────────────────────────────────────────────────┐  │  │
│    step++                                                       │  │  │
│    open(https://clau.de/chrome/reconnect)                       │  │  │
│    detectChromeExtension() ──async──► setExtensionInstalled()   │  │  │
│                               if installed: openingBrowser=false │  │  │
│                                                                 │  │  │
│  [manage-permissions] ─────────────────────────────────────┐   │  │  │
│    step++                                                   │   │  │  │
│    open(https://clau.de/chrome/permissions)                  │   │  │  │
│                                                             │   │  │  │
│  [toggle-default] ──────────────────────────────────────┐  │   │  │  │
│    enabledDefault = !enabledDefault                      │  │   │  │  │
│    updateLocalSettings({claudeInChromeDefaultEnabled})   │  │   │  │  │
│                                                          │  │   │  │  │
│  [Esc / cancel] ──────────────────────────────────────► onDone()   │  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Telemetry Points

The chrome UI integration emits analytics events:

| Event | When | Properties |
|-------|------|-----------|
| `chrome_bridge_connection_started` | WebSocket connect begins | `bridge_url` |
| `chrome_bridge_connection_succeeded` | `paired` or `waiting` received | `duration_ms`, `status` |
| `chrome_bridge_connection_failed` | Error during connect | `duration_ms`, `error_type`, `reconnect_attempt` |
| `chrome_bridge_disconnected` | WebSocket closed | `close_code`, `duration_since_connect_ms` |
| `chrome_bridge_peer_connected` | Extension joined bridge | - |
| `chrome_bridge_peer_disconnected` | Extension left bridge | - |
| `chrome_bridge_tool_call_started` | Tool call sent | `tool_name`, `tool_use_id` |
| `chrome_bridge_tool_call_completed` | Tool result received | `tool_name`, `tool_use_id`, `duration_ms` |
| `chrome_bridge_tool_call_error` | Tool returned error | `tool_name`, `error_message`, `duration_ms` |
| `chrome_bridge_tool_call_timeout` | Tool call exceeded timeout | `tool_name`, `timeout_ms`, `duration_ms` |
| `chrome_bridge_reconnect_exhausted` | 100 reconnect attempts failed | `total_attempts` |
| Page view: `"chrome"` | User opens /chrome settings | - |
