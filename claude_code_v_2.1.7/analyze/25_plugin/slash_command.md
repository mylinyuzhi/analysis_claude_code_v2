# Plugin Slash Command

> The `/plugin` command interface for managing plugins.
>
> **Related Symbols:** See [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Slash Commands section

---

## Quick Navigation

- [Command Structure](#command-structure)
- [CLI Implementation](#cli-implementation)
- [Subcommands](#subcommands)
- [Command Parsing](#command-parsing)
- [View States](#view-states)

---

## Command Structure

The `/plugin` command (aliases: `/plugins`, `/marketplace`) provides a CLI interface for plugin management.

```
/plugin <subcommand> [arguments]

Subcommands:
  install <name>@<marketplace>     Install a plugin
  manage                           View/manage installed plugins
  enable <name>@<marketplace>      Enable a plugin
  disable <name>@<marketplace>     Disable a plugin
  uninstall <name>@<marketplace>   Uninstall a plugin
  update <name>@<marketplace>      Update plugin to latest version
  marketplace add <source>         Add a marketplace source
  marketplace remove <name>        Remove a marketplace source
  marketplace update [name]        Update marketplace(s)
  marketplace list                 List registered marketplaces
  validate [path]                  Validate plugin manifest
  help                             Show help
```

---

## CLI Implementation

The plugin commands are implemented using commander.js in chunks.157.mjs.

```javascript
// ============================================
// Plugin CLI command setup
// Location: chunks.157.mjs:961-1097
// ============================================

// ORIGINAL (for source lookup):
let Z = Q.command("plugin").description("Manage Claude Code plugins").helpOption("-h, --help", "Display help for command").configureHelp(A());

Z.command("validate <path>").description("Validate a plugin or marketplace manifest").helpOption("-h, --help", "Display help for command").action((X) => {
  try {
    let I = Az1(X);  // validatePluginManifest
    if (console.log(`Validating ${I.fileType} manifest: ${I.filePath}\n`), I.errors.length > 0) console.log(`${tA.cross} Found ${I.errors.length} error${I.errors.length===1?"":"s"}:\n`), I.errors.forEach((D) => {
      console.log(`  ${tA.pointer} ${D.path}: ${D.message}`)
    }), console.log("");
    if (I.warnings.length > 0) console.log(`${tA.warning} Found ${I.warnings.length} warning${I.warnings.length===1?"":"s"}:\n`), I.warnings.forEach((D) => {
      console.log(`  ${tA.pointer} ${D.path}: ${D.message}`)
    }), console.log("");
    if (I.success) {
      if (I.warnings.length > 0) console.log(`${tA.tick} Validation passed with warnings`);
      else console.log(`${tA.tick} Validation passed`);
      process.exit(0)
    } else console.log(`${tA.cross} Validation failed`), process.exit(1)
  } catch (I) {
    e(I instanceof Error ? I : Error(String(I))), console.error(`${tA.cross} Unexpected error during validation: ${I instanceof Error?I.message:String(I)}`), process.exit(2)
  }
});

// READABLE (for understanding):
const pluginCommand = program
  .command("plugin")
  .description("Manage Claude Code plugins")
  .helpOption("-h, --help", "Display help for command")
  .configureHelp(formatHelp());

// Validate command
pluginCommand.command("validate <path>")
  .description("Validate a plugin or marketplace manifest")
  .action((path) => {
    try {
      const result = validatePluginManifest(path);

      console.log(`Validating ${result.fileType} manifest: ${result.filePath}\n`);

      // Show errors
      if (result.errors.length > 0) {
        console.log(`✗ Found ${result.errors.length} error(s):\n`);
        result.errors.forEach(error => {
          console.log(`  → ${error.path}: ${error.message}`);
        });
        console.log("");
      }

      // Show warnings
      if (result.warnings.length > 0) {
        console.log(`⚠ Found ${result.warnings.length} warning(s):\n`);
        result.warnings.forEach(warning => {
          console.log(`  → ${warning.path}: ${warning.message}`);
        });
        console.log("");
      }

      // Final status
      if (result.success) {
        if (result.warnings.length > 0) {
          console.log("✓ Validation passed with warnings");
        } else {
          console.log("✓ Validation passed");
        }
        process.exit(0);
      } else {
        console.log("✗ Validation failed");
        process.exit(1);
      }
    } catch (error) {
      logError(error);
      console.error(`✗ Unexpected error during validation: ${error.message}`);
      process.exit(2);
    }
  });

// Mapping: Az1→validatePluginManifest, tA→symbols (tick, cross, pointer, warning)
```

---

## Subcommands

### Install Plugin

```
/plugin install <plugin-name>@<marketplace-name> [-s, --scope <scope>]
```

Installs a plugin from a registered marketplace.

**Options:**
- `--scope <scope>`: Installation scope: user, project, or local (default: user)

**Flow:**
1. Parse plugin ID from arguments
2. Find plugin in marketplace
3. Download/cache plugin
4. Enable in settings
5. Clear caches and reload

```javascript
// ============================================
// Plugin install CLI command
// Location: chunks.157.mjs:1052-1058
// ============================================

// ORIGINAL (for source lookup):
Z.command("install <plugin>").alias("i").description("Install a plugin from available marketplaces (use plugin@marketplace for specific marketplace)").option("-s, --scope <scope>", "Installation scope: user, project, or local", "user").helpOption("-h, --help", "Display help for command").action(async (X, I) => {
  let D = I.scope || "user";
  if (!jU.includes(D)) console.error(`Invalid scope: ${D}. Must be one of: ${jU.join(", ")}.`), process.exit(1);
  l("tengu_plugin_install_command", {
    plugin: X,
    scope: D
  }), await ON9(X, D)
})

// READABLE (for understanding):
pluginCommand
  .command("install <plugin>")
  .alias("i")
  .description("Install a plugin from available marketplaces")
  .option("-s, --scope <scope>", "Installation scope: user, project, or local", "user")
  .action(async (pluginId, options) => {
    const scope = options.scope || "user";

    // Validate scope
    if (!validScopes.includes(scope)) {
      console.error(`Invalid scope: ${scope}. Must be one of: ${validScopes.join(", ")}.`);
      process.exit(1);
    }

    // Track telemetry
    trackEvent("tengu_plugin_install_command", { plugin: pluginId, scope });

    // Execute installation
    await installPluginCommand(pluginId, scope);
  });

// Mapping: ON9→installPluginCommand, jU→validScopes (["user", "project", "local"])
```

### Uninstall Plugin

```
/plugin uninstall <plugin-name>@<marketplace-name> [-s, --scope <scope>]
```

Removes a plugin:
1. Delete from registry
2. Delete cached files
3. Remove from settings

```javascript
// ============================================
// Plugin uninstall CLI command
// Location: chunks.157.mjs:1059-1065
// ============================================

// ORIGINAL (for source lookup):
Z.command("uninstall <plugin>").alias("remove").alias("rm").description("Uninstall an installed plugin").option("-s, --scope <scope>", "Uninstall from scope: user, project, or local", "user").helpOption("-h, --help", "Display help for command").action(async (X, I) => {
  let D = I.scope || "user";
  if (!jU.includes(D)) console.error(`Invalid scope: ${D}. Must be one of: ${jU.join(", ")}.`), process.exit(1);
  l("tengu_plugin_uninstall_command", {
    plugin: X,
    scope: D
  }), await MN9(X, D)
})

// READABLE (for understanding):
pluginCommand
  .command("uninstall <plugin>")
  .alias("remove")
  .alias("rm")
  .description("Uninstall an installed plugin")
  .option("-s, --scope <scope>", "Uninstall from scope: user, project, or local", "user")
  .action(async (pluginId, options) => {
    const scope = options.scope || "user";
    if (!validScopes.includes(scope)) {
      console.error(`Invalid scope: ${scope}.`);
      process.exit(1);
    }
    trackEvent("tengu_plugin_uninstall_command", { plugin: pluginId, scope });
    await uninstallPluginCommand(pluginId, scope);
  });

// Mapping: MN9→uninstallPluginCommand
```

### Enable/Disable Plugin

```
/plugin enable <plugin-name>@<marketplace-name> [-s, --scope <scope>]
/plugin disable <plugin-name>@<marketplace-name> [-s, --scope <scope>]
```

Toggles plugin enable state in `settings.json`.

```javascript
// ============================================
// Plugin enable/disable CLI commands
// Location: chunks.157.mjs:1066-1087
// ============================================

// ORIGINAL (for source lookup):
Z.command("enable <plugin>").description("Enable a disabled plugin").option("-s, --scope <scope>", `Installation scope: ${jU.join(", ")} (default: user)`).helpOption("-h, --help", "Display help for command").action(async (X, I) => {
  let D = "user";
  if (I.scope) {
    if (!jU.includes(I.scope)) process.stderr.write(`Invalid scope "${I.scope}". Valid scopes: ${jU.join(", ")}\n`), process.exit(1);
    D = I.scope
  }
  l("tengu_plugin_enable_command", { plugin: X, scope: D }), await RN9(X, D)
})

Z.command("disable <plugin>").description("Disable an enabled plugin").option("-s, --scope <scope>", `Installation scope: ${jU.join(", ")} (default: user)`).helpOption("-h, --help", "Display help for command").action(async (X, I) => {
  let D = "user";
  if (I.scope) {
    if (!jU.includes(I.scope)) process.stderr.write(`Invalid scope "${I.scope}". Valid scopes: ${jU.join(", ")}\n`), process.exit(1);
    D = I.scope
  }
  l("tengu_plugin_disable_command", { plugin: X, scope: D }), await _N9(X, D)
})

// READABLE (for understanding):
pluginCommand.command("enable <plugin>")
  .description("Enable a disabled plugin")
  .option("-s, --scope <scope>", "Installation scope (default: user)")
  .action(async (pluginId, options) => {
    const scope = options.scope || "user";
    trackEvent("tengu_plugin_enable_command", { plugin: pluginId, scope });
    await enablePluginCommand(pluginId, scope);
  });

pluginCommand.command("disable <plugin>")
  .description("Disable an enabled plugin")
  .option("-s, --scope <scope>", "Installation scope (default: user)")
  .action(async (pluginId, options) => {
    const scope = options.scope || "user";
    trackEvent("tengu_plugin_disable_command", { plugin: pluginId, scope });
    await disablePluginCommand(pluginId, scope);
  });

// Mapping: RN9→enablePluginCommand, _N9→disablePluginCommand
```

### Update Plugin

```
/plugin update <plugin-name>@<marketplace-name> [-s, --scope <scope>]
```

Updates a plugin to the latest version (requires restart to apply).

```javascript
// ============================================
// Plugin update CLI command
// Location: chunks.157.mjs:1088-1096
// ============================================

// ORIGINAL (for source lookup):
Z.command("update <plugin>").description("Update a plugin to the latest version (restart required to apply)").option("-s, --scope <scope>", `Installation scope: ${OgA.join(", ")} (default: user)`).helpOption("-h, --help", "Display help for command").action(async (X, I) => {
  l("tengu_plugin_update_command", {});
  let D = "user";
  if (I.scope) {
    if (!OgA.includes(I.scope)) process.stderr.write(`Invalid scope "${I.scope}". Valid scopes: ${OgA.join(", ")}\n`), process.exit(1);
    D = I.scope
  }
  await jN9(X, D)
})

// READABLE (for understanding):
pluginCommand.command("update <plugin>")
  .description("Update a plugin to the latest version (restart required to apply)")
  .option("-s, --scope <scope>", "Installation scope (default: user)")
  .action(async (pluginId, options) => {
    trackEvent("tengu_plugin_update_command", {});
    const scope = options.scope || "user";
    await updatePluginCommand(pluginId, scope);
  });

// Mapping: jN9→updatePluginCommand, OgA→updateValidScopes
```

### Marketplace Management

```
/plugin marketplace add <source>
/plugin marketplace remove <name>
/plugin marketplace update [name]
/plugin marketplace list
```

Manage registered marketplaces.

```javascript
// ============================================
// Marketplace CLI subcommands
// Location: chunks.157.mjs:983-1051
// ============================================

// ORIGINAL (for source lookup):
let Y = Z.command("marketplace").description("Manage Claude Code marketplaces").helpOption("-h, --help", "Display help for command").configureHelp(A());

// Add marketplace
Y.command("add <source>").description("Add a marketplace from a URL, path, or GitHub repo").helpOption("-h, --help", "Display help for command").action(async (X) => {
  try {
    let I = nE1(X);  // parseMarketplaceSource
    if (!I) console.error(`${tA.cross} Invalid marketplace source format. Try: owner/repo, https://..., or ./path`), process.exit(1);
    if ("error" in I) console.error(`${tA.cross} ${I.error}`), process.exit(1);
    let D = I;
    console.log("Adding marketplace...");
    let { name: W } = await NS(D, (V) => { console.log(V) });  // addMarketplaceSource
    NY();  // clearAllCaches
    let K = D.source;
    if (D.source === "github") K = D.repo;
    l("tengu_marketplace_added", { source_type: K }), console.log(`${tA.tick} Successfully added marketplace: ${W}`), process.exit(0)
  } catch (I) {
    G(I, "add marketplace")
  }
})

// List marketplaces
Y.command("list").description("List all configured marketplaces").helpOption("-h, --help", "Display help for command").action(async () => {
  try {
    let X = await D5(),  // loadMarketplaceConfigs
      I = Object.keys(X);
    if (I.length === 0) console.log("No marketplaces configured"), process.exit(0);
    console.log(`Configured marketplaces:\n`), I.forEach((D) => {
      let W = X[D];
      if (console.log(`  ${tA.pointer} ${D}`), W?.source) {
        let K = W.source;
        if (K.source === "github") console.log(`    Source: GitHub (${K.repo})`);
        else if (K.source === "git") console.log(`    Source: Git (${K.url})`);
        else if (K.source === "url") console.log(`    Source: URL (${K.url})`);
        else if (K.source === "directory") console.log(`    Source: Directory (${K.path})`);
        else if (K.source === "file") console.log(`    Source: File (${K.path})`)
      }
      console.log("")
    }), process.exit(0)
  } catch (X) {
    G(X, "list marketplaces")
  }
})

// Remove marketplace
Y.command("remove <name>").alias("rm").description("Remove a configured marketplace").helpOption("-h, --help", "Display help for command").action(async (X) => {
  try {
    await _Z1(X), NY(), l("tengu_marketplace_removed", { marketplace_name: X }), console.log(`${tA.tick} Successfully removed marketplace: ${X}`), process.exit(0)
  } catch (I) {
    G(I, "remove marketplace")
  }
})

// Update marketplace(s)
Y.command("update [name]").description("Update marketplace(s) from their source - updates all if no name specified").helpOption("-h, --help", "Display help for command").action(async (X) => {
  try {
    if (X) console.log(`Updating marketplace: ${X}...`), await Rr(X, (I) => { console.log(I) }), NY(), l("tengu_marketplace_updated", { marketplace_name: X }), console.log(`${tA.tick} Successfully updated marketplace: ${X}`), process.exit(0);
    else {
      let I = await D5(), D = Object.keys(I);
      if (D.length === 0) console.log("No marketplaces configured"), process.exit(0);
      console.log(`Updating ${D.length} marketplace(s)...`), await X32(), NY(), l("tengu_marketplace_updated_all", { count: D.length }), console.log(`${tA.tick} Successfully updated ${D.length} marketplace(s)`), process.exit(0)
    }
  } catch (I) {
    G(I, "update marketplace(s)")
  }
})

// READABLE (for understanding):
const marketplaceCommand = pluginCommand.command("marketplace")
  .description("Manage Claude Code marketplaces");

marketplaceCommand.command("add <source>")
  .description("Add a marketplace from a URL, path, or GitHub repo")
  .action(async (sourceArg) => {
    try {
      const source = parseMarketplaceSource(sourceArg);
      if (!source) {
        console.error("✗ Invalid marketplace source format. Try: owner/repo, https://..., or ./path");
        process.exit(1);
      }
      if ("error" in source) {
        console.error(`✗ ${source.error}`);
        process.exit(1);
      }

      console.log("Adding marketplace...");
      const { name } = await addMarketplaceSource(source, (msg) => console.log(msg));
      clearAllCaches();
      trackEvent("tengu_marketplace_added", { source_type: source.source === "github" ? source.repo : source.source });
      console.log(`✓ Successfully added marketplace: ${name}`);
      process.exit(0);
    } catch (error) {
      handleError(error, "add marketplace");
    }
  });

marketplaceCommand.command("list")
  .description("List all configured marketplaces")
  .action(async () => {
    const configs = await loadMarketplaceConfigs();
    const names = Object.keys(configs);
    if (names.length === 0) {
      console.log("No marketplaces configured");
      process.exit(0);
    }
    console.log("Configured marketplaces:\n");
    names.forEach(name => {
      console.log(`  → ${name}`);
      const config = configs[name];
      if (config?.source) {
        const src = config.source;
        if (src.source === "github") console.log(`    Source: GitHub (${src.repo})`);
        else if (src.source === "git") console.log(`    Source: Git (${src.url})`);
        // ... etc
      }
      console.log("");
    });
    process.exit(0);
  });

// Mapping: nE1→parseMarketplaceSource, NS→addMarketplaceSource, NY→clearAllCaches,
//          D5→loadMarketplaceConfigs, _Z1→removeMarketplace, Rr→updateMarketplace,
//          X32→updateAllMarketplaces
```

### Validate Plugin

```
/plugin validate <path>
```

Validates a plugin manifest:
- Check `plugin.json` structure
- Verify component paths exist
- Report any errors

---

## Command Parsing

```javascript
// ============================================
// parsePluginCommand - Parse /plugin command arguments
// Location: (slash command handling)
// ============================================

// READABLE (for understanding):
function parsePluginCommand(args) {
  const tokens = args.trim().split(/\s+/);
  const subcommand = tokens[0]?.toLowerCase();

  switch (subcommand) {
    case "install": {
      const pluginId = tokens[1];
      if (!pluginId) {
        return { type: "error", message: "Usage: /plugin install <name>@<marketplace>" };
      }
      const [name, marketplace] = pluginId.split("@");
      if (!name || !marketplace) {
        return { type: "error", message: "Plugin ID must be in format: name@marketplace" };
      }
      return { type: "install", pluginName: name, marketplace };
    }

    case "manage":
      return { type: "manage" };

    case "enable": {
      const pluginId = tokens[1];
      if (!pluginId) {
        return { type: "error", message: "Usage: /plugin enable <name>@<marketplace>" };
      }
      return { type: "enable", pluginId };
    }

    case "disable": {
      const pluginId = tokens[1];
      if (!pluginId) {
        return { type: "error", message: "Usage: /plugin disable <name>@<marketplace>" };
      }
      return { type: "disable", pluginId };
    }

    case "uninstall": {
      const pluginId = tokens[1];
      if (!pluginId) {
        return { type: "error", message: "Usage: /plugin uninstall <name>@<marketplace>" };
      }
      return { type: "uninstall", pluginId };
    }

    case "marketplace": {
      const subSubCommand = tokens[1]?.toLowerCase();
      switch (subSubCommand) {
        case "add":
          return { type: "marketplace-add", source: tokens.slice(2).join(" ") };
        case "remove":
          return { type: "marketplace-remove", name: tokens[2] };
        case "update":
          return { type: "marketplace-update", name: tokens[2] };  // Optional
        case "list":
          return { type: "marketplace-list" };
        default:
          return { type: "error", message: "Usage: /plugin marketplace <add|remove|update|list>" };
      }
    }

    case "validate":
      return { type: "validate", path: tokens[1] };

    case "help":
    case undefined:
      return { type: "help" };

    default:
      return { type: "error", message: `Unknown subcommand: ${subcommand}` };
  }
}
```

---

## View States

The plugin command component manages different view states:

```javascript
// ============================================
// Plugin command view states
// ============================================

type PluginViewState =
  // Initial/help view
  | { view: "help" }

  // Browse marketplace for install
  | { view: "browse"; marketplace?: string; search?: string }

  // Plugin install progress
  | { view: "installing"; pluginId: string; progress?: string }

  // Manage installed plugins
  | { view: "manage"; filter?: "enabled" | "disabled" | "all" }

  // Plugin details
  | { view: "details"; pluginId: string }

  // Marketplace management
  | { view: "marketplace-list" }
  | { view: "marketplace-add"; source?: string; progress?: string }
  | { view: "marketplace-remove"; name?: string }
  | { view: "marketplace-update"; name?: string; progress?: string }

  // Validate plugin
  | { view: "validate"; path?: string; result?: ValidationResult }

  // Error state
  | { view: "error"; message: string }

  // Success state
  | { view: "success"; message: string }
```

### View Transitions

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          VIEW TRANSITIONS                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  /plugin                    →  help                                     │
│  /plugin help               →  help                                     │
│                                                                         │
│  /plugin install X@Y        →  installing → success/error              │
│                                                                         │
│  /plugin manage             →  manage                                   │
│    → select plugin          →  details                                  │
│    → enable/disable         →  manage (refreshed)                       │
│    → uninstall              →  manage (refreshed)                       │
│                                                                         │
│  /plugin marketplace add    →  marketplace-add → success/error         │
│  /plugin marketplace remove →  marketplace-remove → success/error      │
│  /plugin marketplace update →  marketplace-update → success/error      │
│  /plugin marketplace list   →  marketplace-list                        │
│                                                                         │
│  /plugin validate           →  validate → result                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## UI Components

### Manage View

The manage view shows:
- List of installed plugins
- Enable/disable toggle for each
- Uninstall button
- Plugin status (enabled/disabled/error)

```
┌─────────────────────────────────────────────────────────────────┐
│  Installed Plugins                                              │
├─────────────────────────────────────────────────────────────────┤
│  ✓ my-plugin@official                          [Disable] [X]   │
│    Version: 1.0.0                                               │
│    Commands: 3, Skills: 2                                       │
├─────────────────────────────────────────────────────────────────┤
│  ○ another-plugin@custom                       [Enable]  [X]   │
│    Version: 2.1.0 (disabled)                                    │
│    Commands: 1, Skills: 0                                       │
└─────────────────────────────────────────────────────────────────┘
```

### Marketplace List View

```
┌─────────────────────────────────────────────────────────────────┐
│  Registered Marketplaces                                        │
├─────────────────────────────────────────────────────────────────┤
│  official                                                       │
│    Source: github:anthropic/claude-plugins                      │
│    Plugins: 15                                                  │
│    Last updated: 2024-01-15 10:30                              │
│    Auto-update: ✓                                               │
├─────────────────────────────────────────────────────────────────┤
│  custom                                                         │
│    Source: git:git@github.com:my/plugins.git                   │
│    Plugins: 3                                                   │
│    Last updated: 2024-01-10 14:22                              │
│    Auto-update: ○                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Error Handling

```javascript
// ============================================
// Plugin command error handling
// ============================================

// Common error cases:
const errorMessages = {
  "plugin-not-found": (id) =>
    `Plugin '${id}' not found. Check the marketplace is registered and the plugin name is correct.`,

  "marketplace-not-found": (name) =>
    `Marketplace '${name}' not found. Use '/plugin marketplace list' to see available marketplaces.`,

  "already-installed": (id) =>
    `Plugin '${id}' is already installed.`,

  "already-enabled": (id) =>
    `Plugin '${id}' is already enabled.`,

  "already-disabled": (id) =>
    `Plugin '${id}' is already disabled.`,

  "install-failed": (id, error) =>
    `Failed to install plugin '${id}': ${error}`,

  "uninstall-failed": (id, error) =>
    `Failed to uninstall plugin '${id}': ${error}`,

  "marketplace-add-failed": (source, error) =>
    `Failed to add marketplace '${source}': ${error}`,

  "marketplace-blocked": (source) =>
    `Marketplace '${source}' is blocked by enterprise policy.`,

  "invalid-plugin-id": () =>
    `Invalid plugin ID. Use format: plugin-name@marketplace-name`
};
```

---

## Integration with Skill System

Plugins can provide slash commands that are registered with the skill system.

```javascript
// Plugin commands are namespaced:
// /plugin-name:command-name

// Example:
// Plugin "code-tools" with command "format" → /code-tools:format

// Commands are loaded during plugin discovery and merged with
// built-in slash commands in the skill registry.
```

---

## Key Symbols Summary

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `ON9` | installPluginCommand | chunks.157.mjs | Install plugin action |
| `MN9` | uninstallPluginCommand | chunks.157.mjs | Uninstall plugin action |
| `RN9` | enablePluginCommand | chunks.157.mjs | Enable plugin action |
| `_N9` | disablePluginCommand | chunks.157.mjs | Disable plugin action |
| `jN9` | updatePluginCommand | chunks.157.mjs | Update plugin action |
| `NS` | addMarketplaceSource | chunks.91.mjs:136 | Add marketplace |
| `_Z1` | removeMarketplace | chunks.91.mjs | Remove marketplace |
| `Rr` | updateMarketplace | chunks.91.mjs | Update single marketplace |
| `X32` | updateAllMarketplaces | chunks.91.mjs | Update all marketplaces |
| `D5` | loadMarketplaceConfigs | chunks.90.mjs:2232 | Load marketplace configs |
| `NY` | clearAllCaches | chunks.130.mjs:2090 | Clear all plugin caches |
| `nE1` | parseMarketplaceSource | chunks.91.mjs | Parse source string |
| `Az1` | validatePluginManifest | chunks.91.mjs | Validate manifest |
| `jU` | validScopes | chunks.157.mjs | ["user", "project", "local"] |
| `tA` | symbols | chunks.157.mjs | UI symbols (tick, cross, etc) |

---

## Related Files

- [overview.md](./overview.md) - Plugin system architecture
- [installation.md](./installation.md) - Plugin installation
- [marketplace.md](./marketplace.md) - Marketplace management
- [state_management.md](./state_management.md) - Enable/disable state
- [../09_slash_command/](../09_slash_command/) - Slash command system
