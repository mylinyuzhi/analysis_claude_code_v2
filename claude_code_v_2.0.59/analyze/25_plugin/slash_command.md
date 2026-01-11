# /plugin Slash Command

> The `/plugin` command for managing plugins, marketplaces, and installations.
>
> **Related Symbols:** See [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Plugin System section

---

## Quick Navigation

- [Command Syntax](#command-syntax)
- [Command Registration](#command-registration)
- [Command Parsing](#command-parsing)
- [View State Mapping](#view-state-mapping)
- [UI Component](#ui-component)
- [Subcommand Handlers](#subcommand-handlers)

---

## Command Syntax

```bash
# Installation
/plugin install <name>@<marketplace>      # Install from specific marketplace
/plugin install <name>                    # Install from default marketplace
/plugin install <url>                     # Install from URL/path
/plugin uninstall <name>                  # Uninstall plugin

# Management
/plugin manage                            # Open plugin management UI
/plugin enable <name>                     # Enable a disabled plugin
/plugin disable <name>                    # Disable a plugin
/plugin validate [path]                   # Validate plugin manifest

# Marketplace
/plugin marketplace add <url>             # Add marketplace source
/plugin marketplace remove <name>         # Remove marketplace
/plugin marketplace update [name]         # Update marketplace(s)
/plugin marketplace list                  # List configured marketplaces

# Help
/plugin help                              # Show help
/plugin                                   # Show main menu
```

---

## Command Registration

```javascript
// ============================================
// pluginCommand - Command registration
// Location: chunks.152.mjs:403-420
// ============================================

// ORIGINAL (for source lookup):
ix3 = {
  name: "plugin",
  userFacingName: "plugin",
  description: "Manage Claude Code plugins and marketplaces",
  isEnabled: !0,
  isHidden: !1,
  type: "local-jsx",
  aliases: ["plugins", "marketplace"],
  call: (A) => GB.createElement(HC9, {
    onComplete: A.onComplete,
    args: A.args
  })
}

// READABLE (for understanding):
pluginCommand = {
  name: "plugin",
  userFacingName: "plugin",
  description: "Manage Claude Code plugins and marketplaces",
  isEnabled: true,
  isHidden: false,
  type: "local-jsx",           // React component
  aliases: ["plugins", "marketplace"],
  call: (context) => createElement(PluginCommandComponent, {
    onComplete: context.onComplete,
    args: context.args
  })
}

// Command can be invoked as:
// /plugin
// /plugins
// /marketplace

// Mapping: ix3→pluginCommand, HC9→PluginCommandComponent
```

---

## Command Parsing

```javascript
// ============================================
// parsePluginCommand - Parse /plugin command arguments
// Location: chunks.152.mjs:76-164
// ============================================

// ORIGINAL (for source lookup):
function DC9(A) {
  if (!A) return { type: "menu" };

  let Q = A.trim().split(/\s+/);

  switch (Q[0]?.toLowerCase()) {
    case "help":
    case "--help":
    case "-h":
      return { type: "help" };

    case "install":
    case "i": {
      let G = Q[1];
      if (!G) return { type: "install" };

      // Parse plugin@marketplace format
      if (G.includes("@")) {
        let [I, Y] = G.split("@");
        return { type: "install", plugin: I, marketplace: Y };
      }

      // URL/path format
      if (G.startsWith("http://") || G.startsWith("https://") ||
          G.startsWith("file://") || G.includes("/") || G.includes("\\")) {
        return { type: "install", marketplace: G };
      }

      // Just plugin name
      return { type: "install", plugin: G };
    }

    case "manage":
      return { type: "manage" };

    case "uninstall":
      return { type: "uninstall", plugin: Q[1] };

    case "enable":
      return { type: "enable", plugin: Q[1] };

    case "disable":
      return { type: "disable", plugin: Q[1] };

    case "validate":
      return { type: "validate", path: Q.slice(1).join(" ").trim() || void 0 };

    case "marketplace":
    case "market": {
      let G = Q[1]?.toLowerCase(),
          Z = Q.slice(2).join(" ");
      switch (G) {
        case "add":
          return { type: "marketplace", action: "add", target: Z };
        case "remove":
        case "rm":
          return { type: "marketplace", action: "remove", target: Z };
        case "update":
          return { type: "marketplace", action: "update", target: Z };
        case "list":
          return { type: "marketplace", action: "list" };
        default:
          return { type: "marketplace" };
      }
    }

    default:
      return { type: "menu" };
  }
}

// READABLE (for understanding):
function parsePluginCommand(args) {
  if (!args) return { type: "menu" };

  const tokens = args.trim().split(/\s+/);
  const subcommand = tokens[0]?.toLowerCase();

  switch (subcommand) {
    // Help
    case "help":
    case "--help":
    case "-h":
      return { type: "help" };

    // Install
    case "install":
    case "i": {
      const target = tokens[1];
      if (!target) return { type: "install" };

      // Format: plugin@marketplace
      if (target.includes("@")) {
        const [plugin, marketplace] = target.split("@");
        return { type: "install", plugin, marketplace };
      }

      // Format: URL or path
      if (target.startsWith("http://") || target.startsWith("https://") ||
          target.startsWith("file://") || target.includes("/") || target.includes("\\")) {
        return { type: "install", marketplace: target };
      }

      // Format: just plugin name
      return { type: "install", plugin: target };
    }

    // Management
    case "manage":
      return { type: "manage" };

    case "uninstall":
      return { type: "uninstall", plugin: tokens[1] };

    case "enable":
      return { type: "enable", plugin: tokens[1] };

    case "disable":
      return { type: "disable", plugin: tokens[1] };

    case "validate":
      return { type: "validate", path: tokens.slice(1).join(" ").trim() || undefined };

    // Marketplace
    case "marketplace":
    case "market": {
      const action = tokens[1]?.toLowerCase();
      const target = tokens.slice(2).join(" ");

      switch (action) {
        case "add":
          return { type: "marketplace", action: "add", target };
        case "remove":
        case "rm":
          return { type: "marketplace", action: "remove", target };
        case "update":
          return { type: "marketplace", action: "update", target };
        case "list":
          return { type: "marketplace", action: "list" };
        default:
          return { type: "marketplace" };
      }
    }

    default:
      return { type: "menu" };
  }
}

// Mapping: DC9→parsePluginCommand
```

### Parsed Command Types

| Type | Fields | Example Input |
|------|--------|---------------|
| `menu` | - | `/plugin` |
| `help` | - | `/plugin help` |
| `install` | `plugin?`, `marketplace?` | `/plugin install fmt@official` |
| `manage` | - | `/plugin manage` |
| `uninstall` | `plugin` | `/plugin uninstall fmt@official` |
| `enable` | `plugin` | `/plugin enable fmt@official` |
| `disable` | `plugin` | `/plugin disable fmt@official` |
| `validate` | `path?` | `/plugin validate ./my-plugin` |
| `marketplace` | `action?`, `target?` | `/plugin marketplace add <url>` |

---

## View State Mapping

```javascript
// ============================================
// commandToViewState - Map parsed command to UI state
// Location: chunks.152.mjs:186-248
// ============================================

// ORIGINAL (for source lookup):
function lx3(A) {
  switch (A.type) {
    case "help":
      return { type: "help" };

    case "validate":
      return { type: "validate", path: A.path };

    case "install":
      if (A.marketplace || A.plugin) return {
        type: "browse-marketplace",
        targetMarketplace: A.marketplace,
        targetPlugin: A.plugin
      };
      return { type: "browse-marketplace" };

    case "manage":
      return { type: "manage-plugins" };

    case "uninstall":
      return {
        type: "manage-plugins",
        targetPlugin: A.plugin,
        action: "uninstall"
      };

    case "enable":
      return {
        type: "manage-plugins",
        targetPlugin: A.plugin,
        action: "enable"
      };

    case "disable":
      return {
        type: "manage-plugins",
        targetPlugin: A.plugin,
        action: "disable"
      };

    case "marketplace":
      if (A.action === "list") return { type: "marketplace-list" };
      if (A.action === "add") return {
        type: "add-marketplace",
        initialValue: A.target
      };
      if (A.action === "remove") return {
        type: "manage-marketplaces",
        targetMarketplace: A.target,
        action: "remove"
      };
      if (A.action === "update") return {
        type: "manage-marketplaces",
        targetMarketplace: A.target,
        action: "update"
      };
      return { type: "marketplace-menu" };

    case "menu":
    default:
      return { type: "menu" };
  }
}

// READABLE (for understanding):
function commandToViewState(parsedCommand) {
  switch (parsedCommand.type) {
    case "help":
      return { type: "help" };

    case "validate":
      return { type: "validate", path: parsedCommand.path };

    case "install":
      if (parsedCommand.marketplace || parsedCommand.plugin) {
        return {
          type: "browse-marketplace",
          targetMarketplace: parsedCommand.marketplace,
          targetPlugin: parsedCommand.plugin
        };
      }
      return { type: "browse-marketplace" };

    case "manage":
      return { type: "manage-plugins" };

    case "uninstall":
      return {
        type: "manage-plugins",
        targetPlugin: parsedCommand.plugin,
        action: "uninstall"
      };

    case "enable":
      return {
        type: "manage-plugins",
        targetPlugin: parsedCommand.plugin,
        action: "enable"
      };

    case "disable":
      return {
        type: "manage-plugins",
        targetPlugin: parsedCommand.plugin,
        action: "disable"
      };

    case "marketplace":
      switch (parsedCommand.action) {
        case "list":
          return { type: "marketplace-list" };
        case "add":
          return { type: "add-marketplace", initialValue: parsedCommand.target };
        case "remove":
          return { type: "manage-marketplaces", targetMarketplace: parsedCommand.target, action: "remove" };
        case "update":
          return { type: "manage-marketplaces", targetMarketplace: parsedCommand.target, action: "update" };
        default:
          return { type: "marketplace-menu" };
      }

    default:
      return { type: "menu" };
  }
}

// Mapping: lx3→commandToViewState
```

### View State Types

| View Type | Description |
|-----------|-------------|
| `menu` | Main plugin menu |
| `help` | Help text display |
| `browse-marketplace` | Browse plugins for installation |
| `manage-plugins` | Enable/disable/uninstall UI |
| `marketplace-list` | List configured marketplaces |
| `marketplace-menu` | Marketplace management menu |
| `add-marketplace` | Add new marketplace form |
| `manage-marketplaces` | Update/remove marketplaces |
| `validate` | Plugin validation output |

---

## UI Component

```javascript
// ============================================
// PluginCommandComponent - Main plugin UI component
// Location: chunks.152.mjs:250-400
// ============================================

// ORIGINAL (for source lookup):
function HC9({ onComplete: A, args: Q }) {
  let B = DC9(Q),                           // Parse command
      [G, Z] = iO.useState(lx3(B)),          // Initial view state
      [I, Y] = iO.useState(G.type === "add-marketplace" ? G.initialValue || "" : ""),
      [J, W] = iO.useState(0),               // Selection index
      [X, V] = iO.useState(null),            // Error state
      [F, K] = iO.useState(null),            // Success message
      [, D] = OQ(),                          // App state setter
      H = EQ(),                              // App context
      C = B.type === "marketplace" && B.action === "add" && B.target !== void 0;

  // Refresh plugins after state changes
  let E = iO.useCallback(async () => {
    let { enabled: U, disabled: q, errors: w } = await l7(),
        [N, R] = await Promise.all([PQA(), _0A()]);
    D((T) => ({
      ...T,
      plugins: { ...T.plugins, enabled: U, disabled: q, commands: N, agents: R, errors: w }
    }));
  }, [D]);

  // ... render based on view state type
  switch (G.type) {
    case "help":
      return renderHelp(A);
    case "menu":
      return renderMainMenu(G, Z, A, E);
    case "browse-marketplace":
      return renderBrowseMarketplace(G, Z, A, E);
    case "manage-plugins":
      return renderManagePlugins(G, Z, A, E);
    case "marketplace-list":
      return renderMarketplaceList(A);
    case "add-marketplace":
      return renderAddMarketplace(I, Y, Z, A, E);
    case "manage-marketplaces":
      return renderManageMarketplaces(G, Z, A, E);
    case "validate":
      return renderValidate(G.path, A);
    default:
      return renderMainMenu(G, Z, A, E);
  }
}

// READABLE (for understanding):
function PluginCommandComponent({ onComplete, args }) {
  // Parse command arguments
  const parsedCommand = parsePluginCommand(args);

  // State management
  const [viewState, setViewState] = useState(commandToViewState(parsedCommand));
  const [inputValue, setInputValue] = useState(
    viewState.type === "add-marketplace" ? viewState.initialValue || "" : ""
  );
  const [selectionIndex, setSelectionIndex] = useState(0);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [, setAppState] = useContext(AppStateContext);

  // Refresh plugins callback
  const refreshPlugins = useCallback(async () => {
    const { enabled, disabled, errors } = await getPluginsWithState();
    const [commands, agents] = await Promise.all([
      getPluginCommands(),
      getPluginAgents()
    ]);
    setAppState(prev => ({
      ...prev,
      plugins: { ...prev.plugins, enabled, disabled, commands, agents, errors }
    }));
  }, [setAppState]);

  // Render based on view state
  switch (viewState.type) {
    case "help":
      return <HelpView onComplete={onComplete} />;

    case "menu":
      return <MainMenuView
        viewState={viewState}
        setViewState={setViewState}
        onComplete={onComplete}
        refresh={refreshPlugins}
      />;

    case "browse-marketplace":
      return <BrowseMarketplaceView
        viewState={viewState}
        setViewState={setViewState}
        onComplete={onComplete}
        refresh={refreshPlugins}
      />;

    case "manage-plugins":
      return <ManagePluginsView
        viewState={viewState}
        setViewState={setViewState}
        onComplete={onComplete}
        refresh={refreshPlugins}
      />;

    case "marketplace-list":
      return <MarketplaceListView onComplete={onComplete} />;

    case "add-marketplace":
      return <AddMarketplaceView
        inputValue={inputValue}
        setInputValue={setInputValue}
        setViewState={setViewState}
        onComplete={onComplete}
        refresh={refreshPlugins}
      />;

    case "manage-marketplaces":
      return <ManageMarketplacesView
        viewState={viewState}
        setViewState={setViewState}
        onComplete={onComplete}
        refresh={refreshPlugins}
      />;

    case "validate":
      return <ValidateView path={viewState.path} onComplete={onComplete} />;

    default:
      return <MainMenuView {...} />;
  }
}

// Mapping: HC9→PluginCommandComponent, DC9→parsePluginCommand, lx3→commandToViewState,
//          l7→getPluginsWithState, PQA→getPluginCommands, _0A→getPluginAgents
```

---

## Subcommand Handlers

### Validate Component

```javascript
// ============================================
// ValidateComponent - Plugin validation UI
// Location: chunks.152.mjs:3-75
// ============================================

// ORIGINAL (for source lookup):
function FC9({ path: A, onComplete: Q }) {
  let [B, G] = iO.useState("loading"),
      [Z, I] = iO.useState(null);

  iO.useEffect(() => {
    async function Y() {
      try {
        let J = A || process.cwd(),
            W = qJ1(J);  // validatePluginManifest
        if (W.valid) {
          G("success");
          I(W);
        } else {
          G("error");
          I(W);
        }
      } catch (J) {
        G("error");
        I({ valid: !1, errors: [J.message] });
      }
    }
    Y();
  }, [A]);

  // Render validation results...
}

// READABLE (for understanding):
function ValidateComponent({ path, onComplete }) {
  const [status, setStatus] = useState("loading");
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function validate() {
      try {
        const targetPath = path || process.cwd();
        const validationResult = validatePluginManifest(targetPath);

        if (validationResult.valid) {
          setStatus("success");
        } else {
          setStatus("error");
        }
        setResult(validationResult);
      } catch (error) {
        setStatus("error");
        setResult({ valid: false, errors: [error.message] });
      }
    }
    validate();
  }, [path]);

  // Render status and validation results
  if (status === "loading") {
    return <Text>Validating plugin...</Text>;
  }

  if (status === "success") {
    return (
      <Box flexDirection="column">
        <Text color="green">Plugin manifest is valid!</Text>
        <Text>Name: {result.manifest.name}</Text>
        <Text>Version: {result.manifest.version || "not specified"}</Text>
        {/* ... more fields */}
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text color="red">Plugin validation failed:</Text>
      {result.errors.map((err, i) => <Text key={i}>- {err}</Text>)}
    </Box>
  );
}

// Mapping: FC9→ValidateComponent, qJ1→validatePluginManifest
```

### Marketplace List Component

```javascript
// ============================================
// MarketplaceListComponent - List marketplaces
// Location: chunks.152.mjs:166-184
// ============================================

// ORIGINAL (for source lookup):
function px3({ onComplete: A }) {
  iO.useEffect(() => {
    async function Q() {
      try {
        let B = await pZ(),
            G = Object.keys(B);
        if (G.length === 0) {
          A("No marketplaces configured");
        } else {
          A(`Configured marketplaces:\n${G.map((Z)=>`  \u2022 ${Z}`).join("\n")}`);
        }
      } catch (B) {
        A(`Error loading marketplaces: ${B instanceof Error?B.message:String(B)}`);
      }
    }
    Q();
  }, [A]);

  return GB.createElement($, null, "Loading marketplaces...");
}

// READABLE (for understanding):
function MarketplaceListComponent({ onComplete }) {
  useEffect(() => {
    async function loadMarketplaces() {
      try {
        const config = await loadMarketplaceConfig();
        const names = Object.keys(config);

        if (names.length === 0) {
          onComplete("No marketplaces configured");
        } else {
          const list = names.map(name => `  • ${name}`).join("\n");
          onComplete(`Configured marketplaces:\n${list}`);
        }
      } catch (error) {
        onComplete(`Error loading marketplaces: ${error.message}`);
      }
    }
    loadMarketplaces();
  }, [onComplete]);

  return <Text>Loading marketplaces...</Text>;
}

// Mapping: px3→MarketplaceListComponent, pZ→loadMarketplaceConfig
```

---

## Command Flow Diagram

```
User Input: /plugin install code-formatter@official
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              parsePluginCommand (DC9)                           │
│                                                                 │
│  Input: "install code-formatter@official"                       │
│  Output: { type: "install",                                     │
│            plugin: "code-formatter",                            │
│            marketplace: "official" }                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              commandToViewState (lx3)                           │
│                                                                 │
│  Input: { type: "install", plugin: "code-formatter", ... }      │
│  Output: { type: "browse-marketplace",                          │
│            targetMarketplace: "official",                       │
│            targetPlugin: "code-formatter" }                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              PluginCommandComponent (HC9)                       │
│                                                                 │
│  Renders: BrowseMarketplaceView                                 │
│  • Shows plugin details                                         │
│  • Confirms installation                                        │
│  • Calls installation functions                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Installation Flow                                   │
│                                                                 │
│  1. findPluginInMarketplaces (nl)                               │
│  2. cachePluginFromSource (SIA)                                 │
│  3. copyToVersionedCache (s22)                                  │
│  4. addInstalledPlugin (M39)                                    │
│  5. refreshPlugins (clear caches, reload)                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Telemetry Events

| Event | Description |
|-------|-------------|
| `tengu_plugin_installed` | Plugin installation completed |
| `tengu_plugin_install_command` | Install command invoked |
| `tengu_plugin_uninstall_command` | Uninstall command invoked |
| `tengu_plugin_enable_command` | Enable command invoked |
| `tengu_plugin_disable_command` | Disable command invoked |
| `tengu_plugin_installed_cli` | Successful CLI installation |

---

## Key Symbols Summary

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `ix3` | pluginCommand | chunks.152.mjs:403 | Command registration |
| `EC9` | pluginCommandRef | chunks.152.mjs:421 | Command reference |
| `DC9` | parsePluginCommand | chunks.152.mjs:76 | Parse arguments |
| `lx3` | commandToViewState | chunks.152.mjs:186 | Map to view state |
| `HC9` | PluginCommandComponent | chunks.152.mjs:250 | Main UI component |
| `FC9` | ValidateComponent | chunks.152.mjs:3 | Validation UI |
| `px3` | MarketplaceListComponent | chunks.152.mjs:166 | List marketplaces |
| `GC9` | ManagePluginsComponent | chunks.151.mjs | Manage plugins UI |
| `tH9` | BrowseMarketplaceComponent | chunks.151.mjs | Browse marketplace |
| `qJ1` | validatePluginManifest | chunks.152.mjs | Manifest validation |

---

## Related Files

- [overview.md](./overview.md) - Plugin system architecture
- [marketplace.md](./marketplace.md) - Marketplace management
- [installation.md](./installation.md) - Plugin installation
- [state_management.md](./state_management.md) - Enable/disable state
