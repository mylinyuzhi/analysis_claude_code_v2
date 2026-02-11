# Browser Control (Claude in Chrome) Analysis

## Module Overview

Claude Code v2.1.38 introduces "Claude in Chrome", a deep integration with the Google Chrome browser (and variants like Brave/Arc). It allows the agent to perform web automation via a dedicated browser extension and a Native Messaging bridge.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions and constants in this document:
- `ChromeOnboarding` (VKz) - React component for extension setup
- `getChromeMcpConfig` (HBA) - Configures the MCP server for browser tools
- `CHROME_EXTENSION_ID` (OKz) - `fcoeoabgfenejglbffodgkkbkcdhcgfn`
- `NATIVE_HOST_NAME` (wBA) - `com.anthropic.claude_code_browser_extension`

## Architecture: The Three-Tier Bridge

The system operates via three distinct layers:
1. **CLI Agent**: The user-facing terminal interface.
2. **Native Host**: A lightweight Node.js script spawned by Chrome that communicates with the CLI via `stdio` and with Chrome via Native Messaging.
3. **Chrome Extension**: The browser-side component that executes actions (click, type, etc.) in the active tab.

### Discovery and Detection (Algorithm)

**What it does:** Locates the installed Chrome extension across multiple browser profiles.

**How it works:**
1. Scans standard browser data directories (e.g., `~/Library/Application Support/Google/Chrome/`).
2. Identifies "Default" and "Profile X" directories.
3. Checks for the extension ID (`fcoeoabgfenejglbffodgkkbkcdhcgfn`) in the `Extensions` subfolder.
4. If found, marks the browser as "Compatible".

```javascript
// ============================================
// SHq - Chrome Extension Detection
// Location: chunks.166.mjs:1287-1325
// ============================================

// READABLE (for understanding):
async function detectChromeExtension(browserPaths) {
    const EXTENSION_ID = "fcoeoabgfenejglbffodgkkbkcdhcgfn";
    
    for (const { browser, path } of browserPaths) {
        const profiles = await listDirectories(path).filter(d => 
            d.name === "Default" || d.name.startsWith("Profile ")
        );
        
        for (const profile of profiles) {
            const extensionPath = join(path, profile, "Extensions", EXTENSION_ID);
            if (await exists(extensionPath)) {
                return { isInstalled: true, browser: browser };
            }
        }
    }
    return { isInstalled: false, browser: null };
}
```

## Native Host Registration

To communicate with Chrome, the CLI must register a "Native Messaging Host". This involves writing a JSON manifest to a specific system location.

```javascript
// ============================================
// installNativeHostManifest - Registry/File setup
// Location: chunks.166.mjs:1407-1429
// ============================================

// READABLE (for understanding):
async function installNativeHostManifest(wrapperScriptPath) {
    const manifest = {
        name: "com.anthropic.claude_code_browser_extension",
        description: "Claude Code Browser Extension Native Host",
        path: wrapperScriptPath,
        type: "stdio",
        allowed_origins: ["chrome-extension://fcoeoabgfenejglbffodgkkbkcdhcgfn/"]
    };

    const targetPaths = getPlatformManifestPaths(); // e.g. ~/Library/Application Support/Google/Chrome/NativeMessagingHosts
    for (const targetPath of targetPaths) {
        await writeFile(join(targetPath, "com.anthropic.claude_code_browser_extension.json"), manifest);
    }
}
```

## Browser Automation Tools

When the `claude-in-chrome` skill is enabled, the CLI starts an internal MCP server that exposes tools prefixed with `mcp__claude-in-chrome__`.

**Available Capabilities:**
- **Navigation**: `navigate`, `go_back`, `go_forward`, `reload`.
- **Interaction**: `click`, `type`, `scroll`, `hover`.
- **Observation**: `screenshot`, `record_gif`, `get_console_logs`, `get_network_requests`.
- **State**: `get_active_tab`, `list_tabs`, `switch_tab`.

## Security and Permissions

- **Isolation**: Each automation request requires explicit site-level permissions, which are managed within the Chrome extension itself.
- **Human-in-the-loop**: For high-risk actions, the extension may prompt the user to "Connect" or "Approve" the action in the browser UI.

**Key insight:** By using Native Messaging instead of a protocol like CDP (Chrome DevTools Protocol), Claude Code avoids needing to launch a separate "Automation" browser instance and can instead interact directly with the user's existing, authenticated Chrome session.
