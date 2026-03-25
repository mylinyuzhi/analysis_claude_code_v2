# IDE Support Matrix (Claude Code 2.1.76)

## Overview

Claude Code integrates with multiple IDEs through a unified MCP-based protocol. IDEs are categorized into two families: **VS Code family** (VS Code, Cursor, Windsurf, VSCodium) and **JetBrains family** (IntelliJ IDEA, PyCharm, WebStorm, etc.). Additionally, Zed editor is supported as a terminal integration. This document lists all supported IDEs, their detection mechanisms, extension installation, and platform-specific considerations.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - IDE Integration

Key symbols in this document:
- `gX6` - IDE configuration map (all supported IDEs)
- `kN7` - JetBrains IDE plugin ID mapping
- `vl3` - VS Code extension ID constant (`anthropic.claude-code`)
- `bp3` - JetBrains plugin ID constant (`claude-code-jetbrains-plugin`)
- `Dl1` - JetBrains IDE name array (for terminal/editor detection)
- `eL7` - Terminal editor display names map
- `Nl3` - VS Code extension installer function
- `kl3` - macOS process path resolver for VS Code family

---

## IDE Family Classification

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Supported IDE Ecosystem                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  VS Code Family (ideKind: "vscode")        JetBrains Family (ideKind: "jetbrains")│
│  ┌────────────────────────────────┐        ┌────────────────────────────────┐ │
│  │ • VS Code                      │        │ • IntelliJ IDEA               │ │
│  │ • Cursor                       │        │ • PyCharm                     │ │
│  │ • Windsurf                     │        │ • WebStorm                    │ │
│  │ • VSCodium                     │        │ • PhpStorm                    │ │
│  │                                │        │ • RubyMine                    │ │
│  │ Extension:                     │        │ • CLion                       │ │
│  │ anthropic.claude-code          │        │ • GoLand                      │ │
│  │                                │        │ • Rider                       │ │
│  │ Protocol: WebSocket/SSE        │        │ • DataGrip                    │ │
│  └────────────────────────────────┘        │ • AppCode                     │ │
│                                            │ • DataSpell                   │ │
│  Terminal Integrations                     │ • Aqua                        │ │
│  ┌────────────────────────────────┐        │ • Gateway                     │ │
│  │ • Zed (keymap.json)            │        │ • Fleet                       │ │
│  │ • Alacritty (shift-enter)      │        │ • Android Studio              │ │
│  │ • Apple Terminal (option meta) │        │                              │ │
│  └────────────────────────────────┘        │ Plugin:                       │ │
│                                            │ claude-code-jetbrains-plugin  │ │
│                                            │                              │ │
│                                            │ Protocol: WebSocket           │ │
│                                            └────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## IDE Configuration Map: `gX6`

**Location:** `chunks.65.mjs:2112-2239`

```javascript
// ============================================
// IDE_CONFIG_MAP - Configuration for all supported IDEs
// Location: chunks.65.mjs:2112-2239
// ============================================

// ORIGINAL (for source lookup):
gX6 = {
    cursor: {
        ideKind: "vscode",
        displayName: "Cursor",
        processKeywordsMac: ["Cursor Helper", "Cursor.app"],
        processKeywordsWindows: ["cursor.exe"],
        processKeywordsLinux: ["cursor"]
    },
    windsurf: {
        ideKind: "vscode",
        displayName: "Windsurf",
        processKeywordsMac: ["Windsurf Helper", "Windsurf.app"],
        processKeywordsWindows: ["windsurf.exe"],
        processKeywordsLinux: ["windsurf"]
    },
    vscode: {
        ideKind: "vscode",
        displayName: "VS Code",
        processKeywordsMac: ["Visual Studio Code", "Code Helper"],
        processKeywordsWindows: ["code.exe"],
        processKeywordsLinux: ["code"]
    },
    intellij: {
        ideKind: "jetbrains",
        displayName: "IntelliJ IDEA",
        processKeywordsMac: ["IntelliJ IDEA"],
        processKeywordsWindows: ["idea64.exe"],
        processKeywordsLinux: ["idea", "intellij"]
    },
    // ... (15 more JetBrains IDEs)
    androidstudio: {
        ideKind: "jetbrains",
        displayName: "Android Studio",
        processKeywordsMac: ["Android Studio"],
        processKeywordsWindows: ["studio64.exe"],
        processKeywordsLinux: ["android-studio"]
    }
};

// READABLE (for understanding):
const IDE_CONFIG_MAP = {
    // VS Code Family (4 IDEs)
    cursor: {
        ideKind: "vscode",
        displayName: "Cursor",
        processKeywordsMac: ["Cursor Helper", "Cursor.app"],
        processKeywordsWindows: ["cursor.exe"],
        processKeywordsLinux: ["cursor"]
    },
    windsurf: {
        ideKind: "vscode",
        displayName: "Windsurf",
        processKeywordsMac: ["Windsurf Helper", "Windsurf.app"],
        processKeywordsWindows: ["windsurf.exe"],
        processKeywordsLinux: ["windsurf"]
    },
    vscode: {
        ideKind: "vscode",
        displayName: "VS Code",
        processKeywordsMac: ["Visual Studio Code", "Code Helper"],
        processKeywordsWindows: ["code.exe"],
        processKeywordsLinux: ["code"]
    },

    // JetBrains Family (15 IDEs)
    intellij: {
        ideKind: "jetbrains",
        displayName: "IntelliJ IDEA",
        processKeywordsMac: ["IntelliJ IDEA"],
        processKeywordsWindows: ["idea64.exe"],
        processKeywordsLinux: ["idea", "intellij"]
    },
    pycharm: {
        ideKind: "jetbrains",
        displayName: "PyCharm",
        processKeywordsMac: ["PyCharm"],
        processKeywordsWindows: ["pycharm64.exe"],
        processKeywordsLinux: ["pycharm"]
    },
    webstorm: {
        ideKind: "jetbrains",
        displayName: "WebStorm",
        processKeywordsMac: ["WebStorm"],
        processKeywordsWindows: ["webstorm64.exe"],
        processKeywordsLinux: ["webstorm"]
    },
    phpstorm: {
        ideKind: "jetbrains",
        displayName: "PhpStorm",
        processKeywordsMac: ["PhpStorm"],
        processKeywordsWindows: ["phpstorm64.exe"],
        processKeywordsLinux: ["phpstorm"]
    },
    rubymine: {
        ideKind: "jetbrains",
        displayName: "RubyMine",
        processKeywordsMac: ["RubyMine"],
        processKeywordsWindows: ["rubymine64.exe"],
        processKeywordsLinux: ["rubymine"]
    },
    clion: {
        ideKind: "jetbrains",
        displayName: "CLion",
        processKeywordsMac: ["CLion"],
        processKeywordsWindows: ["clion64.exe"],
        processKeywordsLinux: ["clion"]
    },
    goland: {
        ideKind: "jetbrains",
        displayName: "GoLand",
        processKeywordsMac: ["GoLand"],
        processKeywordsWindows: ["goland64.exe"],
        processKeywordsLinux: ["goland"]
    },
    rider: {
        ideKind: "jetbrains",
        displayName: "Rider",
        processKeywordsMac: ["Rider"],
        processKeywordsWindows: ["rider64.exe"],
        processKeywordsLinux: ["rider"]
    },
    datagrip: {
        ideKind: "jetbrains",
        displayName: "DataGrip",
        processKeywordsMac: ["DataGrip"],
        processKeywordsWindows: ["datagrip64.exe"],
        processKeywordsLinux: ["datagrip"]
    },
    appcode: {
        ideKind: "jetbrains",
        displayName: "AppCode",
        processKeywordsMac: ["AppCode"],
        processKeywordsWindows: ["appcode.exe"],
        processKeywordsLinux: ["appcode"]
    },
    dataspell: {
        ideKind: "jetbrains",
        displayName: "DataSpell",
        processKeywordsMac: ["DataSpell"],
        processKeywordsWindows: ["dataspell64.exe"],
        processKeywordsLinux: ["dataspell"]
    },
    aqua: {
        ideKind: "jetbrains",
        displayName: "Aqua",
        processKeywordsMac: [],
        processKeywordsWindows: ["aqua64.exe"],
        processKeywordsLinux: []
    },
    gateway: {
        ideKind: "jetbrains",
        displayName: "Gateway",
        processKeywordsMac: [],
        processKeywordsWindows: ["gateway64.exe"],
        processKeywordsLinux: []
    },
    fleet: {
        ideKind: "jetbrains",
        displayName: "Fleet",
        processKeywordsMac: [],
        processKeywordsWindows: ["fleet.exe"],
        processKeywordsLinux: []
    },
    androidstudio: {
        ideKind: "jetbrains",
        displayName: "Android Studio",
        processKeywordsMac: ["Android Studio"],
        processKeywordsWindows: ["studio64.exe"],
        processKeywordsLinux: ["android-studio"]
    }
};

// Mapping: gX6→IDE_CONFIG_MAP
```

---

## Complete IDE Support Table

| IDE | Family | macOS Keywords | Windows Keywords | Linux Keywords |
|-----|--------|---------------|------------------|----------------|
| **VS Code** | vscode | Visual Studio Code, Code Helper | code.exe | code |
| **Cursor** | vscode | Cursor Helper, Cursor.app | cursor.exe | cursor |
| **Windsurf** | vscode | Windsurf Helper, Windsurf.app | windsurf.exe | windsurf |
| **IntelliJ IDEA** | jetbrains | IntelliJ IDEA | idea64.exe | idea, intellij |
| **PyCharm** | jetbrains | PyCharm | pycharm64.exe | pycharm |
| **WebStorm** | jetbrains | WebStorm | webstorm64.exe | webstorm |
| **PhpStorm** | jetbrains | PhpStorm | phpstorm64.exe | phpstorm |
| **RubyMine** | jetbrains | RubyMine | rubymine64.exe | rubymine |
| **CLion** | jetbrains | CLion | clion64.exe | clion |
| **GoLand** | jetbrains | GoLand | goland64.exe | goland |
| **Rider** | jetbrains | Rider | rider64.exe | rider |
| **DataGrip** | jetbrains | DataGrip | datagrip64.exe | datagrip |
| **AppCode** | jetbrains | AppCode | appcode.exe | appcode |
| **DataSpell** | jetbrains | DataSpell | dataspell64.exe | dataspell |
| **Aqua** | jetbrains | (none) | aqua64.exe | (none) |
| **Gateway** | jetbrains | (none) | gateway64.exe | (none) |
| **Fleet** | jetbrains | (none) | fleet.exe | (none) |
| **Android Studio** | jetbrains | Android Studio | studio64.exe | android-studio |

**Total:** 19 supported IDEs (4 VS Code family + 15 JetBrains family)

---

## JetBrains Plugin ID Mapping: `kN7`

**Location:** `chunks.58.mjs:1698-1714`

```javascript
// ============================================
// JETBRAINS_PLUGIN_ID_MAP - Maps IDE key to JetBrains plugin directory names
// Location: chunks.58.mjs:1698-1714
// ============================================

// ORIGINAL (for source lookup):
kN7 = {
    pycharm: ["PyCharm"],
    intellij: ["IntelliJIdea", "IdeaIC"],
    webstorm: ["WebStorm"],
    phpstorm: ["PhpStorm"],
    rubymine: ["RubyMine"],
    clion: ["CLion"],
    goland: ["GoLand"],
    rider: ["Rider"],
    datagrip: ["DataGrip"],
    appcode: ["AppCode"],
    dataspell: ["DataSpell"],
    aqua: ["Aqua"],
    gateway: ["Gateway"],
    fleet: ["Fleet"],
    androidstudio: ["AndroidStudio"]
};

// READABLE (for understanding):
const JETBRAINS_PLUGIN_ID_MAP = {
    pycharm: ["PyCharm"],           // JetBrains plugin directory name
    intellij: ["IntelliJIdea", "IdeaIC"],  // Ultimate + Community editions
    webstorm: ["WebStorm"],
    phpstorm: ["PhpStorm"],
    rubymine: ["RubyMine"],
    clion: ["CLion"],
    goland: ["GoLand"],
    rider: ["Rider"],
    datagrip: ["DataGrip"],
    appcode: ["AppCode"],
    dataspell: ["DataSpell"],
    aqua: ["Aqua"],
    gateway: ["Gateway"],
    fleet: ["Fleet"],
    androidstudio: ["AndroidStudio"]
};

// Mapping: kN7→JETBRAINS_PLUGIN_ID_MAP
```

**Why multiple values for IntelliJ:** IntelliJ IDEA has two editions (Ultimate and Community) with different plugin directory names (`IntelliJIdea` vs `IdeaIC`). Both need to be supported.

---

## Extension/Plugin Installation

### VS Code Family Extension

**Extension ID:** `anthropic.claude-code` (`vl3` constant)

```javascript
// ============================================
// installVSCodeExtension - Install Claude Code extension in VS Code family IDEs
// Location: chunks.65.mjs:1827-1846
// ============================================

// ORIGINAL (for source lookup):
async function Nl3(A) {
    if (E$1(A)) {
        let q = await YR7(A);
        if (q) {
            let K = await Vl3(q);
            if (!K || iD6(K, tL7())) {
                await new Promise((z) => {
                    setTimeout(z, 500)
                });
                let Y = await RA(q, ["--force", "--install-extension", "anthropic.claude-code"], {
                    env: oj8()
                });
                if (Y.code !== 0) throw Error(`${Y.code}: ${Y.error} ${Y.stderr}`);
                K = tL7()
            }
            return K
        }
    }
    return null
}

// READABLE (for understanding):
async function installVSCodeExtension(ideType) {
    if (!isVSCodeFamily(ideType)) return null;

    let cliPath = await resolveIdeCliPath(ideType);
    if (!cliPath) return null;

    // Check if extension is already installed
    let installedVersion = await getInstalledExtensionVersion(cliPath);

    // Install or update if needed
    if (!installedVersion || isOutdatedVersion(installedVersion, CURRENT_VERSION)) {
        await delay(500);  // Brief pause before install

        let result = await executeCommand(cliPath, [
            "--force",
            "--install-extension",
            "anthropic.claude-code"
        ], { env: getEnvironmentForPlatform() });

        if (result.code !== 0) {
            throw new Error(`${result.code}: ${result.error} ${result.stderr}`);
        }

        installedVersion = CURRENT_VERSION;
    }

    return installedVersion;
}

// Mapping: Nl3→installVSCodeExtension, E$1→isVSCodeFamily, YR7→resolveIdeCliPath,
//          Vl3→getInstalledExtensionVersion, iD6→isOutdatedVersion, RA→executeCommand,
//          tL7→CURRENT_VERSION, oj8→getEnvironmentForPlatform
```

**Linux environment handling:**
```javascript
// ============================================
// getEnvironmentForPlatform - Adjust environment for Linux CLI operations
// Location: chunks.65.mjs:1848-1854
// ============================================

// ORIGINAL (for source lookup):
function oj8() {
    if (y8() === "linux") return {
        ...process.env,
        DISPLAY: ""
    };
    return
}

// READABLE (for understanding):
function getEnvironmentForPlatform() {
    // On Linux, clear DISPLAY to prevent IDE from trying to open a GUI window
    // when running CLI commands like --install-extension
    if (getPlatform() === "linux") {
        return {
            ...process.env,
            DISPLAY: ""  // Prevent GUI window spawn
        };
    }
    return undefined;  // Use default environment
}

// Mapping: oj8→getEnvironmentForPlatform, y8→getPlatform
```

### JetBrains Plugin

**Plugin ID:** `claude-code-jetbrains-plugin` (`bp3` constant)

JetBrains plugins are installed through the IDE's plugin marketplace, not via CLI. The user is directed to install the plugin from the JetBrains Marketplace.

---

## Terminal/Editor Detection

### JetBrains IDE Detection Array

**Location:** `chunks.14.mjs:444`

```javascript
// ============================================
// JETBRAINS_IDE_NAMES - Array of JetBrains IDE names for detection
// Location: chunks.14.mjs:444
// ============================================

// ORIGINAL (for source lookup):
Dl1 = ["pycharm", "intellij", "webstorm", "phpstorm", "rubymine", "clion", "goland", "rider", "datagrip", "appcode", "dataspell", "aqua", "gateway", "fleet", "jetbrains", "androidstudio"];

// READABLE (for understanding):
const JETBRAINS_IDE_NAMES = [
    "pycharm", "intellij", "webstorm", "phpstorm", "rubymine",
    "clion", "goland", "rider", "datagrip", "appcode", "dataspell",
    "aqua", "gateway", "fleet", "jetbrains", "androidstudio"
];

// Mapping: Dl1→JETBRAINS_IDE_NAMES
```

### Terminal Editor Display Names

**Location:** `chunks.65.mjs:2247-2260`

```javascript
// ============================================
// TERMINAL_EDITOR_NAMES - Display names for terminal editors
// Location: chunks.65.mjs:2247-2260
// ============================================

// ORIGINAL (for source lookup):
eL7 = {
    code: "VS Code",
    cursor: "Cursor",
    windsurf: "Windsurf",
    antigravity: "Antigravity",
    vi: "Vim",
    vim: "Vim",
    nano: "nano",
    notepad: "Notepad",
    "start /wait notepad": "Notepad",
    emacs: "Emacs",
    subl: "Sublime Text",
    atom: "Atom"
};

// READABLE (for understanding):
const TERMINAL_EDITOR_NAMES = {
    code: "VS Code",
    cursor: "Cursor",
    windsurf: "Windsurf",
    antigravity: "Antigravity",
    vi: "Vim",
    vim: "Vim",
    nano: "nano",
    notepad: "Notepad",
    "start /wait notepad": "Notepad",
    emacs: "Emacs",
    subl: "Sublime Text",
    atom: "Atom"
};

// Mapping: eL7→TERMINAL_EDITOR_NAMES
```

---

## macOS Process Path Resolution

**Location:** `chunks.65.mjs:1881-1912`

```javascript
// ============================================
// resolveIdeCliPath - Resolve CLI path by walking parent process tree
// Location: chunks.65.mjs:1881-1912
// ============================================

// ORIGINAL (for source lookup):
function kl3() {
    try {
        if (y8() !== "macos") return null;
        let q = process.ppid;
        for (let K = 0; K < 10; K++) {
            if (!q || q === 0 || q === 1) break;
            let Y = yT(`ps -o command= -p ${q}`)?.trim();
            if (Y) {
                let _ = {
                        "Visual Studio Code.app": "code",
                        "Cursor.app": "cursor",
                        "Windsurf.app": "windsurf",
                        "Visual Studio Code - Insiders.app": "code",
                        "VSCodium.app": "codium"
                    },
                    w = "/Contents/MacOS/Electron";
                for (let [O, $] of Object.entries(_)) {
                    let H = Y.indexOf(O + "/Contents/MacOS/Electron");
                    if (H !== -1) {
                        let j = H + O.length;
                        return Y.substring(0, j) + "/Contents/Resources/app/bin/" + $
                    }
                }
            }
            let z = yT(`ps -o ppid= -p ${q}`)?.trim();
            if (!z) break;
            q = parseInt(z.trim())
        }
        return null
    } catch {
        return null
    }
}

// READABLE (for understanding):
function resolveIdeCliPath() {
    try {
        if (getPlatform() !== "macos") return null;

        let pid = process.ppid;

        // Walk up the process tree (max 10 levels)
        for (let i = 0; i < 10; i++) {
            if (!pid || pid === 0 || pid === 1) break;

            let command = executeSync(`ps -o command= -p ${pid}`)?.trim();

            if (command) {
                const APP_TO_CLI = {
                    "Visual Studio Code.app": "code",
                    "Cursor.app": "cursor",
                    "Windsurf.app": "windsurf",
                    "Visual Studio Code - Insiders.app": "code",
                    "VSCodium.app": "codium"
                };

                for (let [appName, cliName] of Object.entries(APP_TO_CLI)) {
                    let electronPath = appName + "/Contents/MacOS/Electron";
                    let idx = command.indexOf(electronPath);

                    if (idx !== -1) {
                        // Extract the .app path and construct CLI path
                        let appEnd = idx + appName.length;
                        return command.substring(0, appEnd) + "/Contents/Resources/app/bin/" + cliName;
                    }
                }
            }

            // Move to parent process
            let parentPid = executeSync(`ps -o ppid= -p ${pid}`)?.trim();
            if (!parentPid) break;
            pid = parseInt(parentPid.trim());
        }

        return null;
    } catch {
        return null;
    }
}

// Mapping: kl3→resolveIdeCliPath, y8→getPlatform, yT→executeSync
```

**Why process tree walking:** On macOS, when Claude Code runs in a terminal inside VS Code, the terminal is a child process of the IDE. By walking up the process tree, we can find the parent IDE process and extract its CLI path for extension installation.

---

## Terminal Integration Support

### Supported Terminal Editors

Claude Code supports Shift+Enter key binding installation for several terminal editors:

| Terminal | Integration Method | Config Location |
|----------|-------------------|-----------------|
| VS Code | `keybindings.json` | `~/Library/Application Support/Code/User/keybindings.json` |
| Cursor | `keybindings.json` | `~/Library/Application Support/Cursor/User/keybindings.json` |
| Windsurf | `keybindings.json` | `~/.config/windsurf/User/keybindings.json` |
| Zed | `keymap.json` | `~/.config/zed/keymap.json` |
| Alacritty | `alacritty.toml` | `~/.config/alacritty/alacritty.toml` |
| Apple Terminal | `.term_init` | AppleScript injection |

### Terminal Detection

**Location:** `chunks.85.mjs:966-967`

```javascript
// ORIGINAL (for source lookup):
function I06() {
    return OX1() === "darwin" && Q8.terminal === "Apple_Terminal" || Q8.terminal === "vscode" || Q8.terminal === "cursor" || Q8.terminal === "windsurf" || Q8.terminal === "alacritty" || Q8.terminal === "zed"
}

// READABLE (for understanding):
function supportsShiftEnterKeyBinding() {
    return (
        (isMacOS() && terminalType === "Apple_Terminal") ||
        terminalType === "vscode" ||
        terminalType === "cursor" ||
        terminalType === "windsurf" ||
        terminalType === "alacritty" ||
        terminalType === "zed"
    );
}

// Mapping: I06→supportsShiftEnterKeyBinding, OX1→isMacOS, Q8→environmentInfo
```

---

## Environment-Based IDE Detection

**Location:** `chunks.14.mjs:314-320`

```javascript
// ============================================
// detectIdeFromEnvironment - Detect IDE from environment variables
// Location: chunks.14.mjs:314-320
// ============================================

// ORIGINAL (for source lookup):
if (process.env.CURSOR_TRACE_ID) return "cursor";
if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes("cursor")) return "cursor";
if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes("windsurf")) return "windsurf";
// ...
if (A?.includes("windsurf")) return "windsurf";

// READABLE (for understanding):
function detectIdeFromEnvironment() {
    // Cursor sets this environment variable
    if (process.env.CURSOR_TRACE_ID) return "cursor";

    // Git askpass path reveals the IDE
    if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes("cursor")) return "cursor";
    if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes("windsurf")) return "windsurf";

    // Additional path-based detection
    if (somePath?.includes("windsurf")) return "windsurf";

    return null;
}
```

**Key insight:** VS Code family IDEs set environment variables like `VSCODE_GIT_ASKPASS_MAIN` that can be used to detect which specific fork/variant is running.

---

## Platform Considerations

### Windows

- JetBrains IDEs use `*64.exe` naming convention (e.g., `idea64.exe`)
- VS Code family uses `.exe` directly (e.g., `code.exe`, `cursor.exe`)

### macOS

- IDE detection via process tree walking (`ps` command)
- App bundle path extraction for CLI resolution
- Application Support directories for config files

### Linux

- `DISPLAY` environment cleared during CLI operations to prevent GUI spawn
- Config files in `~/.config/` directory
- Process names used for detection

---

## Related Documents

- [overview.md](./overview.md) - High-level IDE architecture
- [connection_lifecycle.md](./connection_lifecycle.md) - IDE connection management
- [ide_tools.md](./ide_tools.md) - MCP tools exposed by IDE
- [diagnostics_manager.md](./diagnostics_manager.md) - LSP diagnostics management