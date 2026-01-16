# CLI Subcommands

## Overview

Claude Code v2.1.7 provides several subcommand groups for managing MCP servers, plugins, marketplaces, authentication, and system health. This document covers all subcommand trees and their functionality.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

Key functions in this document:
- `commandHandler` (J_7) - Main command setup where subcommands are registered
- `validatePlugin` (Az1) - Plugin manifest validation
- `installPlugin` (ON9) - Plugin installation
- `addMarketplace` (NS) - Marketplace addition
- `checkServerHealth` (EL9) - MCP server health check

---

## Subcommand Tree Overview

```
claude
├── mcp                              # MCP server management
│   ├── serve                        # Start MCP server
│   ├── list                         # List configured servers
│   ├── get <name>                   # Get server details
│   ├── add-json <name> <json>       # Add server with JSON
│   ├── add-from-claude-desktop      # Import from Claude Desktop
│   ├── remove <name>                # Remove server
│   └── reset-project-choices        # Reset .mcp.json approvals
├── plugin                           # Plugin management
│   ├── validate <path>              # Validate manifest
│   ├── install <plugin>             # Install plugin
│   ├── uninstall <plugin>           # Uninstall plugin
│   ├── enable <plugin>              # Enable plugin
│   ├── disable <plugin>             # Disable plugin
│   ├── update <plugin>              # Update plugin
│   └── marketplace                  # Marketplace management
│       ├── add <source>             # Add marketplace
│       ├── list                     # List marketplaces
│       ├── remove <name>            # Remove marketplace
│       └── update [name]            # Update marketplace(s)
├── setup-token                      # OAuth token setup
├── doctor                           # Health check
├── update                           # Check for updates
└── install [target]                 # Install native build
```

---

## MCP Subcommand Group

### Overview

The `mcp` subcommand group manages MCP (Model Context Protocol) server configurations for the Claude Code instance.

```javascript
// ============================================
// mcpSubcommand - MCP server management group
// Location: chunks.157.mjs:793
// ============================================

// ORIGINAL (for source lookup):
let B = Q.command("mcp").description("Configure and manage MCP servers").helpOption("-h, --help", "Display help for command").configureHelp(A()).enablePositionalOptions();

// READABLE (for understanding):
const mcpCommand = commander.command("mcp")
  .description("Configure and manage MCP servers")
  .helpOption("-h, --help", "Display help for command")
  .configureHelp(customHelpFormatter())
  .enablePositionalOptions();
```

### mcp serve

**Usage:** `claude mcp serve [-d] [--verbose]`

**Description:** Starts the Claude Code MCP server, allowing external tools to use Claude Code capabilities via MCP protocol.

**Options:**
- `-d, --debug` - Enable debug mode
- `--verbose` - Enable verbose output

```javascript
// ============================================
// mcpServe - Start the Claude Code MCP server
// Location: chunks.157.mjs:794-804
// ============================================

// ORIGINAL (for source lookup):
B.command("serve").description("Start the Claude Code MCP server").helpOption("-h, --help", "Display help for command").option("-d, --debug", "Enable debug mode", () => !0).option("--verbose", "Override verbose mode setting from config", () => !0).action(async ({
  debug: X,
  verbose: I
}) => {
  let D = qy0();  // getWorkingDirectory
  if (l("tengu_mcp_start", {}), !XU1(D)) console.error(`Error: Directory ${D} does not exist`), process.exit(1);
  try {
    await IU1(D, "default", !1, !1, void 0),  // initializeWorkspace
    await WN9(D, X ?? !1, I ?? !1)            // startMcpServer
  } catch (W) {
    console.error("Error: Failed to start MCP server:", W), process.exit(1)
  }
});

// Mapping: qy0→getWorkingDirectory, XU1→directoryExists, IU1→initializeWorkspace, WN9→startMcpServer
```

### mcp list

**Usage:** `claude mcp list`

**Description:** Lists all configured MCP servers with their health status.

```javascript
// ============================================
// mcpList - List configured MCP servers
// Location: chunks.157.mjs:850-881
// ============================================

// ORIGINAL (for source lookup):
B.command("list").description("List configured MCP servers").helpOption("-h, --help", "Display help for command").action(async () => {
  l("tengu_mcp_list", {});
  let {
    servers: X
  } = await it();  // getMcpConfiguration
  if (Object.keys(X).length === 0) console.log("No MCP servers configured. Use `claude mcp add` to add a server.");
  else {
    console.log(`Checking MCP server health...\n`);
    let I = Object.entries(X),
      D = await DS0(I, async ([W, K]) => ({
        name: W,
        server: K,
        status: await EL9(W, K)  // checkServerHealth
      }), {
        concurrency: HL0()
      });
    for (let { name: W, server: K, status: V } of D)
      if (K.type === "sse") console.log(`${W}: ${K.url} (SSE) - ${V}`);
      else if (K.type === "http") console.log(`${W}: ${K.url} (HTTP) - ${V}`);
      else if (K.type === "claudeai-proxy") console.log(`${W}: ${K.url} - ${V}`);
      else if (!K.type || K.type === "stdio") {
        let F = Array.isArray(K.args) ? K.args : [];
        console.log(`${W}: ${K.command} ${F.join(" ")} - ${V}`)
      }
  }
  await w3(0)  // gracefulExit
});

// Mapping: it→getMcpConfiguration, DS0→mapConcurrent, EL9→checkServerHealth, HL0→getConcurrency, w3→gracefulExit
```

**Output Example:**
```
Checking MCP server health...

filesystem: node /path/to/server.js - healthy
database: https://db.example.com/mcp (SSE) - healthy
external-api: node /path/to/api.js - unhealthy
```

### mcp get <name>

**Usage:** `claude mcp get <name>`

**Description:** Gets detailed information about a specific MCP server.

```javascript
// ============================================
// mcpGet - Get details about an MCP server
// Location: chunks.157.mjs:882-909
// ============================================

// ORIGINAL (for source lookup):
B.command("get <name>").description("Get details about an MCP server").helpOption("-h, --help", "Display help for command").action(async (X) => {
  l("tengu_mcp_get", { name: X });
  let I = vs(X);  // findMcpServer
  if (!I) console.error(`No MCP server found with name: ${X}`), process.exit(1);
  console.log(`${X}:`);
  console.log(`  Scope: ${HgA(I.scope)}`);  // formatScope
  let D = await EL9(X, I);
  console.log(`  Status: ${D}`);
  if (I.type === "sse") {
    console.log("  Type: sse");
    console.log(`  URL: ${I.url}`);
    if (I.headers) {
      console.log("  Headers:");
      for (let [W, K] of Object.entries(I.headers)) console.log(`    ${W}: ${K}`)
    }
  } else if (I.type === "http") {
    console.log("  Type: http");
    console.log(`  URL: ${I.url}`);
    // ... headers
  } else if (I.type === "stdio") {
    console.log("  Type: stdio");
    console.log(`  Command: ${I.command}`);
    let W = Array.isArray(I.args) ? I.args : [];
    console.log(`  Args: ${W.join(" ")}`);
    // ... environment variables
  }
  console.log(`\nTo remove this server, run: claude mcp remove "${X}" -s ${I.scope}`);
  await w3(0)
});

// Mapping: vs→findMcpServer, HgA→formatScope, EL9→checkServerHealth
```

### mcp add-json <name> <json>

**Usage:** `claude mcp add-json <name> <json> [-s <scope>]`

**Description:** Adds an MCP server configuration using a JSON string.

**Options:**
- `-s, --scope <scope>` - Configuration scope: local, user, or project (default: local)

```javascript
// ============================================
// mcpAddJson - Add MCP server with JSON configuration
// Location: chunks.157.mjs:910-923
// ============================================

// ORIGINAL (for source lookup):
B.command("add-json <name> <json>").description("Add an MCP server (stdio or SSE) with a JSON string").option("-s, --scope <scope>", "Configuration scope (local, user, or project)", "local").helpOption("-h, --help", "Display help for command").action(async (X, I, D) => {
  try {
    let W = z$A(D.scope),  // validateScope
      K = c5(I);           // parseJSON
    uf(X, K, W);           // addMcpServer
    let V = K && typeof K === "object" && "type" in K ? String(K.type || "stdio") : "stdio";
    l("tengu_mcp_add", { scope: W, source: "json", type: V });
    console.log(`Added ${V} MCP server ${X} to ${W} config`);
    process.exit(0)
  } catch (W) {
    console.error(W.message);
    process.exit(1)
  }
});

// Mapping: z$A→validateScope, c5→parseJSON, uf→addMcpServer
```

**Example:**
```bash
# Add stdio server
claude mcp add-json myserver '{"command": "node", "args": ["/path/to/server.js"]}'

# Add SSE server
claude mcp add-json remote-server '{"type": "sse", "url": "https://api.example.com/mcp"}'

# Add to specific scope
claude mcp add-json myserver '{"command": "python", "args": ["server.py"]}' -s project
```

### mcp add-from-claude-desktop

**Usage:** `claude mcp add-from-claude-desktop [-s <scope>]`

**Description:** Imports MCP server configurations from Claude Desktop application (Mac and WSL only).

**Options:**
- `-s, --scope <scope>` - Configuration scope (default: local)

```javascript
// ============================================
// mcpAddFromClaudeDesktop - Import from Claude Desktop
// Location: chunks.157.mjs:924-948
// ============================================

// ORIGINAL (for source lookup):
B.command("add-from-claude-desktop").description("Import MCP servers from Claude Desktop (Mac and WSL only)").option("-s, --scope <scope>", "Configuration scope (local, user, or project)", "local").helpOption("-h, --help", "Display help for command").action(async (X) => {
  try {
    let I = z$A(X.scope),
      D = $Q();  // getPlatform
    l("tengu_mcp_add", { scope: I, platform: D, source: "desktop" });
    let W = xq9();  // getClaudeDesktopMcpServers
    if (Object.keys(W).length === 0) {
      console.log("No MCP servers found in Claude Desktop configuration or configuration file does not exist.");
      process.exit(0);
    }
    // Interactive server selection UI
    let { unmount: K } = await Y5(K3.default.createElement(b5, null, K3.default.createElement(vJ, null, K3.default.createElement(Tq9, {
      servers: W,
      scope: I,
      onDone: () => { K() }
    }))), { exitOnCtrlC: !0 })
  } catch (I) {
    console.error(I.message);
    process.exit(1)
  }
});

// Mapping: xq9→getClaudeDesktopMcpServers, Tq9→ServerImportUI
```

### mcp remove <name>

**Usage:** `claude mcp remove <name> [-s <scope>]`

**Description:** Removes an MCP server configuration.

**Options:**
- `-s, --scope <scope>` - Specific scope to remove from (if server exists in multiple scopes)

```javascript
// ============================================
// mcpRemove - Remove an MCP server
// Location: chunks.157.mjs:805-849
// ============================================

// ORIGINAL (for source lookup):
B.command("remove <name>").description("Remove an MCP server").option("-s, --scope <scope>", "Configuration scope (local, user, or project) - if not specified, removes from whichever scope it exists in").helpOption("-h, --help", "Display help for command").action(async (X, I) => {
  try {
    if (I.scope) {
      let H = z$A(I.scope);
      l("tengu_mcp_delete", { name: X, scope: H });
      WL0(X, H);  // removeMcpServer
      process.stdout.write(`Removed MCP server ${X} from ${H} config\n`);
      process.stdout.write(`File modified: ${N$(H)}\n`);
      process.exit(0)
    }
    // Find all scopes containing this server
    let D = JG(),     // getLocalSettings
      W = L1(),       // getUserSettings
      { servers: K } = GW("project"),  // getProjectSettings
      V = !!K[X],
      F = [];
    if (D.mcpServers?.[X]) F.push("local");
    if (V) F.push("project");
    if (W.mcpServers?.[X]) F.push("user");

    if (F.length === 0) {
      process.stderr.write(`No MCP server found with name: "${X}"\n`);
      process.exit(1);
    } else if (F.length === 1) {
      let H = F[0];
      WL0(X, H);
      process.stdout.write(`Removed MCP server "${X}" from ${H} config\n`);
      process.exit(0);
    } else {
      // Server exists in multiple scopes - require explicit scope
      process.stderr.write(`MCP server "${X}" exists in multiple scopes:\n`);
      F.forEach((H) => {
        process.stderr.write(`  - ${HgA(H)} (${N$(H)})\n`)
      });
      process.stderr.write(`\nTo remove from a specific scope, use:\n`);
      F.forEach((H) => {
        process.stderr.write(`  claude mcp remove "${X}" -s ${H}\n`)
      });
      process.exit(1);
    }
  } catch (D) {
    process.stderr.write(`${D.message}\n`);
    process.exit(1)
  }
});

// Mapping: WL0→removeMcpServer, N$→getConfigPath, JG→getLocalSettings,
//          L1→getUserSettings, GW→getProjectSettings
```

### mcp reset-project-choices

**Usage:** `claude mcp reset-project-choices`

**Description:** Resets all approved and rejected project-scoped (.mcp.json) servers within the current project.

```javascript
// ============================================
// mcpResetProjectChoices - Reset .mcp.json approvals
// Location: chunks.157.mjs:949-956
// ============================================

// ORIGINAL (for source lookup):
B.command("reset-project-choices").description("Reset all approved and rejected project-scoped (.mcp.json) servers within this project").helpOption("-h, --help", "Display help for command").action(async () => {
  l("tengu_mcp_reset_mcpjson_choices", {});
  BZ((X) => ({  // updateLocalSettings
    ...X,
    enabledMcpjsonServers: [],
    disabledMcpjsonServers: [],
    enableAllProjectMcpServers: !1
  }));
  console.log("All project-scoped (.mcp.json) server approvals and rejections have been reset.");
  console.log("You will be prompted for approval next time you start Claude Code.");
  process.exit(0)
});

// Mapping: BZ→updateLocalSettings
```

---

## Plugin Subcommand Group

### Overview

The `plugin` subcommand group manages Claude Code plugins including installation, validation, and lifecycle management.

```javascript
// ============================================
// pluginSubcommand - Plugin management group
// Location: chunks.157.mjs:961
// ============================================

let Z = Q.command("plugin").description("Manage Claude Code plugins").helpOption("-h, --help", "Display help for command").configureHelp(A());
```

### plugin validate <path>

**Usage:** `claude plugin validate <path>`

**Description:** Validates a plugin or marketplace manifest file.

```javascript
// ============================================
// pluginValidate - Validate plugin manifest
// Location: chunks.157.mjs:962-981
// ============================================

// ORIGINAL (for source lookup):
Z.command("validate <path>").description("Validate a plugin or marketplace manifest").helpOption("-h, --help", "Display help for command").action((X) => {
  try {
    let I = Az1(X);  // validateManifest
    console.log(`Validating ${I.fileType} manifest: ${I.filePath}\n`);

    if (I.errors.length > 0) {
      console.log(`${tA.cross} Found ${I.errors.length} error${I.errors.length===1?"":"s"}:\n`);
      I.errors.forEach((D) => {
        console.log(`  ${tA.pointer} ${D.path}: ${D.message}`)
      });
      console.log("");
    }

    if (I.warnings.length > 0) {
      console.log(`${tA.warning} Found ${I.warnings.length} warning${I.warnings.length===1?"":"s"}:\n`);
      I.warnings.forEach((D) => {
        console.log(`  ${tA.pointer} ${D.path}: ${D.message}`)
      });
      console.log("");
    }

    if (I.success) {
      if (I.warnings.length > 0) console.log(`${tA.tick} Validation passed with warnings`);
      else console.log(`${tA.tick} Validation passed`);
      process.exit(0);
    } else {
      console.log(`${tA.cross} Validation failed`);
      process.exit(1);
    }
  } catch (I) {
    console.error(`${tA.cross} Unexpected error during validation: ${I instanceof Error?I.message:String(I)}`);
    process.exit(2);
  }
});

// Mapping: Az1→validateManifest, tA→symbols (tick, cross, warning, pointer)
```

### validateManifest Algorithm Deep Analysis

**What it does:** Validates plugin or marketplace manifest files, checking both JSON schema compliance and content-specific rules.

**How it works:**

```javascript
// ============================================
// validateManifest - Main validation entry point
// Location: chunks.140.mjs:2404-2448
// ============================================

// ORIGINAL (for source lookup):
function Az1(A) {
  let Q = Mj.resolve(A);
  // Check if it's a directory
  if (TU.existsSync(Q) && TU.statSync(Q).isDirectory()) {
    let G = Mj.join(Q, ".claude-plugin", "marketplace.json"),
        Z = Mj.join(Q, ".claude-plugin", "plugin.json");
    // Prefer marketplace.json over plugin.json
    if (TU.existsSync(G)) return w_0(G);
    else if (TU.existsSync(Z)) return N_0(Z);
    else return {
      success: !1,
      errors: [{ path: "directory", message: "No manifest found..." }],
      warnings: [],
      filePath: Q,
      fileType: "plugin"
    }
  }
  // Determine file type and validate
  switch (PX7(A)) {
    case "plugin": return N_0(A);      // validatePluginManifest
    case "marketplace": return w_0(A); // validateMarketplaceManifest
    case "unknown": {
      // Try to detect type from content
      if (!TU.existsSync(Q)) return { success: !1, errors: [{ path: "file", message: `File not found: ${Q}` }] };
      try {
        let G = TU.readFileSync(Q, { encoding: "utf-8" }),
            Z = AQ(G);
        if (Array.isArray(Z.plugins)) return w_0(A)  // Has plugins array = marketplace
      } catch {}
      return N_0(A)  // Default to plugin
    }
  }
}

// READABLE (for understanding):
function validateManifest(path) {
  const resolvedPath = resolvePath(path);

  // Directory handling: look for standard manifest locations
  if (existsSync(resolvedPath) && statSync(resolvedPath).isDirectory()) {
    const marketplacePath = join(resolvedPath, ".claude-plugin", "marketplace.json");
    const pluginPath = join(resolvedPath, ".claude-plugin", "plugin.json");

    // Prefer marketplace.json when both exist
    if (existsSync(marketplacePath)) return validateMarketplaceManifest(marketplacePath);
    else if (existsSync(pluginPath)) return validatePluginManifest(pluginPath);
    else return {
      success: false,
      errors: [{ path: "directory", message: "No manifest found in directory. Expected .claude-plugin/marketplace.json or .claude-plugin/plugin.json" }],
      warnings: [],
      filePath: resolvedPath,
      fileType: "plugin"
    };
  }

  // File handling: determine type and validate
  switch (detectFileType(path)) {
    case "plugin": return validatePluginManifest(path);
    case "marketplace": return validateMarketplaceManifest(path);
    case "unknown": {
      // Auto-detect from content
      if (!existsSync(resolvedPath)) {
        return { success: false, errors: [{ path: "file", message: `File not found: ${resolvedPath}` }], warnings: [], filePath: resolvedPath, fileType: "plugin" };
      }
      try {
        const content = readFileSync(resolvedPath, { encoding: "utf-8" });
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed.plugins)) return validateMarketplaceManifest(path);
      } catch {}
      return validatePluginManifest(path);  // Default to plugin
    }
  }
}

// Mapping: Az1→validateManifest, Mj→path, TU→fs, PX7→detectFileType,
//          N_0→validatePluginManifest, w_0→validateMarketplaceManifest, AQ→JSON.parse
```

**Plugin validation algorithm (N_0):**

```javascript
// ============================================
// validatePluginManifest - Plugin manifest validation
// Location: chunks.140.mjs:2212-2304
// ============================================

// Validation steps:
// 1. File existence check
// 2. File read verification
// 3. JSON syntax validation
// 4. Path reference validation (commands, agents, skills)
// 5. Zod schema validation (V4A.safeParse)
// 6. Warning generation (version, description, author)

function validatePluginManifest(path) {
  let errors = [];
  let warnings = [];
  const resolvedPath = resolvePath(path);

  // Step 1: File existence
  if (!existsSync(resolvedPath)) {
    return { success: false, errors: [{ path: "file", message: `File not found: ${resolvedPath}` }], warnings: [], filePath: resolvedPath, fileType: "plugin" };
  }

  // Step 2: Read file
  let content;
  try {
    content = readFileSync(resolvedPath, { encoding: "utf-8" });
  } catch (error) {
    return { success: false, errors: [{ path: "file", message: `Failed to read file: ${error.message}` }], warnings: [], filePath: resolvedPath, fileType: "plugin" };
  }

  // Step 3: Parse JSON
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    return { success: false, errors: [{ path: "json", message: `Invalid JSON syntax: ${error.message}` }], warnings: [], filePath: resolvedPath, fileType: "plugin" };
  }

  // Step 4: Validate path references
  if (parsed?.commands) {
    (Array.isArray(parsed.commands) ? parsed.commands : [parsed.commands]).forEach((cmd, i) => {
      if (typeof cmd === "string") validatePathReference(cmd, `commands[${i}]`, errors);
    });
  }
  if (parsed?.agents) {
    (Array.isArray(parsed.agents) ? parsed.agents : [parsed.agents]).forEach((agent, i) => {
      if (typeof agent === "string") validatePathReference(agent, `agents[${i}]`, errors);
    });
  }
  if (parsed?.skills) {
    (Array.isArray(parsed.skills) ? parsed.skills : [parsed.skills]).forEach((skill, i) => {
      if (typeof skill === "string") validatePathReference(skill, `skills[${i}]`, errors);
    });
  }

  // Step 5: Schema validation
  const schemaResult = pluginManifestSchema.safeParse(parsed);
  if (!schemaResult.success) {
    errors.push(...formatZodErrors(schemaResult.error));
  }

  // Step 6: Generate warnings for best practices
  if (schemaResult.success) {
    const data = schemaResult.data;
    if (!data.version) warnings.push({ path: "version", message: 'No version specified. Consider adding a version following semver (e.g., "1.0.0")' });
    if (!data.description) warnings.push({ path: "description", message: "No description provided. Adding a description helps users understand what your plugin does" });
    if (!data.author) warnings.push({ path: "author", message: "No author information provided. Consider adding author details for plugin attribution" });
  }

  return {
    success: errors.length === 0,
    errors: errors,
    warnings: warnings,
    filePath: resolvedPath,
    fileType: "plugin"
  };
}

// Mapping: N_0→validatePluginManifest, V4A→pluginManifestSchema, I49→formatZodErrors, RgA→validatePathReference
```

**Validation result structure:**

```typescript
interface ValidationResult {
  success: boolean;           // True if no errors
  errors: ValidationError[];  // Fatal issues
  warnings: ValidationError[];// Non-fatal suggestions
  filePath: string;          // Resolved file path
  fileType: "plugin" | "marketplace";
}

interface ValidationError {
  path: string;    // JSON path (e.g., "commands[0]", "version")
  message: string; // Human-readable error message
}
```

**Key insight:** The validator prioritizes marketplace manifests over plugin manifests when both exist in a directory, ensuring proper detection when a plugin is part of a larger marketplace distribution.

### plugin install <plugin>

**Usage:** `claude plugin install <plugin> [-s <scope>]`

**Alias:** `claude plugin i <plugin>`

**Description:** Installs a plugin from available marketplaces.

**Options:**
- `-s, --scope <scope>` - Installation scope: user, project, or local (default: user)

```javascript
// ============================================
// pluginInstall - Install a plugin
// Location: chunks.157.mjs:1052-1058
// ============================================

// ORIGINAL (for source lookup):
Z.command("install <plugin>").alias("i").description("Install a plugin from available marketplaces (use plugin@marketplace for specific marketplace)").option("-s, --scope <scope>", "Installation scope: user, project, or local", "user").helpOption("-h, --help", "Display help for command").action(async (X, I) => {
  let D = I.scope || "user";
  if (!jU.includes(D)) {
    console.error(`Invalid scope: ${D}. Must be one of: ${jU.join(", ")}.`);
    process.exit(1);
  }
  l("tengu_plugin_install_command", { plugin: X, scope: D });
  await ON9(X, D)  // installPlugin
});

// Mapping: jU→validScopes, ON9→installPlugin
```

**Examples:**
```bash
# Install plugin
claude plugin install my-plugin

# Install from specific marketplace
claude plugin install my-plugin@official-marketplace

# Install to project scope
claude plugin install my-plugin -s project
```

### plugin uninstall <plugin>

**Usage:** `claude plugin uninstall <plugin> [-s <scope>]`

**Aliases:** `claude plugin remove`, `claude plugin rm`

**Description:** Uninstalls an installed plugin.

**Options:**
- `-s, --scope <scope>` - Scope to uninstall from (default: user)

```javascript
// ============================================
// pluginUninstall - Uninstall a plugin
// Location: chunks.157.mjs:1059-1065
// ============================================

// ORIGINAL (for source lookup):
Z.command("uninstall <plugin>").alias("remove").alias("rm").description("Uninstall an installed plugin").option("-s, --scope <scope>", "Uninstall from scope: user, project, or local", "user").helpOption("-h, --help", "Display help for command").action(async (X, I) => {
  let D = I.scope || "user";
  if (!jU.includes(D)) {
    console.error(`Invalid scope: ${D}. Must be one of: ${jU.join(", ")}.`);
    process.exit(1);
  }
  l("tengu_plugin_uninstall_command", { plugin: X, scope: D });
  await MN9(X, D)  // uninstallPlugin
});

// Mapping: MN9→uninstallPlugin
```

### plugin enable/disable <plugin>

**Usage:**
- `claude plugin enable <plugin> [-s <scope>]`
- `claude plugin disable <plugin> [-s <scope>]`

**Description:** Enables or disables a plugin without uninstalling it.

**Options:**
- `-s, --scope <scope>` - Scope (default: user)

```javascript
// ============================================
// pluginEnable/Disable - Toggle plugin state
// Location: chunks.157.mjs:1066-1087
// ============================================

// enable
Z.command("enable <plugin>").description("Enable a disabled plugin").option("-s, --scope <scope>", `Installation scope: ${jU.join(", ")} (default: user)`).action(async (X, I) => {
  // ... scope validation
  l("tengu_plugin_enable_command", { plugin: X, scope: D });
  await RN9(X, D)  // enablePlugin
});

// disable
Z.command("disable <plugin>").description("Disable an enabled plugin").option("-s, --scope <scope>", `Installation scope: ${jU.join(", ")} (default: user)`).action(async (X, I) => {
  // ... scope validation
  l("tengu_plugin_disable_command", { plugin: X, scope: D });
  await _N9(X, D)  // disablePlugin
});

// Mapping: RN9→enablePlugin, _N9→disablePlugin
```

### plugin update <plugin>

**Usage:** `claude plugin update <plugin> [-s <scope>]`

**Description:** Updates a plugin to the latest version (restart required to apply).

**Options:**
- `-s, --scope <scope>` - Scope (default: user)

```javascript
// ============================================
// pluginUpdate - Update a plugin
// Location: chunks.157.mjs:1088-1096
// ============================================

// ORIGINAL (for source lookup):
Z.command("update <plugin>").description("Update a plugin to the latest version (restart required to apply)").option("-s, --scope <scope>", `Installation scope: ${OgA.join(", ")} (default: user)`).action(async (X, I) => {
  l("tengu_plugin_update_command", {});
  let D = "user";
  if (I.scope) {
    if (!OgA.includes(I.scope)) {
      process.stderr.write(`Invalid scope "${I.scope}". Valid scopes: ${OgA.join(", ")}\n`);
      process.exit(1);
    }
    D = I.scope;
  }
  await jN9(X, D)  // updatePlugin
});

// Mapping: OgA→updateScopes, jN9→updatePlugin
```

---

## Marketplace Subcommand Group

### Overview

The `marketplace` subcommand (nested under `plugin`) manages plugin marketplaces from which plugins can be installed.

```javascript
// ============================================
// marketplaceSubcommand - Marketplace management group
// Location: chunks.157.mjs:983
// ============================================

let Y = Z.command("marketplace").description("Manage Claude Code marketplaces").helpOption("-h, --help", "Display help for command").configureHelp(A());
```

### marketplace add <source>

**Usage:** `claude plugin marketplace add <source>`

**Description:** Adds a marketplace from a URL, path, or GitHub repo.

**Source formats:**
- GitHub: `owner/repo`
- URL: `https://example.com/marketplace.json`
- Local path: `./path/to/marketplace`

```javascript
// ============================================
// marketplaceAdd - Add a marketplace
// Location: chunks.157.mjs:984-1004
// ============================================

// ORIGINAL (for source lookup):
Y.command("add <source>").description("Add a marketplace from a URL, path, or GitHub repo").helpOption("-h, --help", "Display help for command").action(async (X) => {
  try {
    let I = nE1(X);  // parseMarketplaceSource
    if (!I) {
      console.error(`${tA.cross} Invalid marketplace source format. Try: owner/repo, https://..., or ./path`);
      process.exit(1);
    }
    if ("error" in I) {
      console.error(`${tA.cross} ${I.error}`);
      process.exit(1);
    }
    let D = I;
    console.log("Adding marketplace...");
    let { name: W } = await NS(D, (V) => { console.log(V) });  // addMarketplace
    NY();  // clearMarketplaceCache
    let K = D.source;
    if (D.source === "github") K = D.repo;
    l("tengu_marketplace_added", { source_type: K });
    console.log(`${tA.tick} Successfully added marketplace: ${W}`);
    process.exit(0);
  } catch (I) {
    G(I, "add marketplace")
  }
});

// Mapping: nE1→parseMarketplaceSource, NS→addMarketplace, NY→clearMarketplaceCache
```

### marketplace list

**Usage:** `claude plugin marketplace list`

**Description:** Lists all configured marketplaces.

```javascript
// ============================================
// marketplaceList - List configured marketplaces
// Location: chunks.157.mjs:1005-1025
// ============================================

// ORIGINAL (for source lookup):
Y.command("list").description("List all configured marketplaces").helpOption("-h, --help", "Display help for command").action(async () => {
  try {
    let X = await D5(),  // getMarketplaces
      I = Object.keys(X);
    if (I.length === 0) {
      console.log("No marketplaces configured");
      process.exit(0);
    }
    console.log(`Configured marketplaces:\n`);
    I.forEach((D) => {
      let W = X[D];
      console.log(`  ${tA.pointer} ${D}`);
      if (W?.source) {
        let K = W.source;
        if (K.source === "github") console.log(`    Source: GitHub (${K.repo})`);
        else if (K.source === "git") console.log(`    Source: Git (${K.url})`);
        else if (K.source === "url") console.log(`    Source: URL (${K.url})`);
        else if (K.source === "directory") console.log(`    Source: Directory (${K.path})`);
        else if (K.source === "file") console.log(`    Source: File (${K.path})`);
      }
      console.log("");
    });
    process.exit(0);
  } catch (X) {
    G(X, "list marketplaces")
  }
});

// Mapping: D5→getMarketplaces
```

### marketplace remove <name>

**Usage:** `claude plugin marketplace remove <name>`

**Alias:** `claude plugin marketplace rm <name>`

**Description:** Removes a configured marketplace.

```javascript
// ============================================
// marketplaceRemove - Remove a marketplace
// Location: chunks.157.mjs:1026-1033
// ============================================

// ORIGINAL (for source lookup):
Y.command("remove <name>").alias("rm").description("Remove a configured marketplace").helpOption("-h, --help", "Display help for command").action(async (X) => {
  try {
    await _Z1(X);  // removeMarketplace
    NY();          // clearMarketplaceCache
    l("tengu_marketplace_removed", { marketplace_name: X });
    console.log(`${tA.tick} Successfully removed marketplace: ${X}`);
    process.exit(0);
  } catch (I) {
    G(I, "remove marketplace")
  }
});

// Mapping: _Z1→removeMarketplace
```

### marketplace update [name]

**Usage:** `claude plugin marketplace update [name]`

**Description:** Updates marketplace(s) from their source. Updates all if no name specified.

```javascript
// ============================================
// marketplaceUpdate - Update marketplace(s)
// Location: chunks.157.mjs:1034-1051
// ============================================

// ORIGINAL (for source lookup):
Y.command("update [name]").description("Update marketplace(s) from their source - updates all if no name specified").helpOption("-h, --help", "Display help for command").action(async (X) => {
  try {
    if (X) {
      // Update specific marketplace
      console.log(`Updating marketplace: ${X}...`);
      await Rr(X, (I) => { console.log(I) });  // updateMarketplace
      NY();
      l("tengu_marketplace_updated", { marketplace_name: X });
      console.log(`${tA.tick} Successfully updated marketplace: ${X}`);
      process.exit(0);
    } else {
      // Update all marketplaces
      let I = await D5(),
        D = Object.keys(I);
      if (D.length === 0) {
        console.log("No marketplaces configured");
        process.exit(0);
      }
      console.log(`Updating ${D.length} marketplace(s)...`);
      await X32();  // updateAllMarketplaces
      NY();
      l("tengu_marketplace_updated_all", { count: D.length });
      console.log(`${tA.tick} Successfully updated ${D.length} marketplace(s)`);
      process.exit(0);
    }
  } catch (I) {
    G(I, "update marketplace(s)")
  }
});

// Mapping: Rr→updateMarketplace, X32→updateAllMarketplaces
```

---

## Utility Subcommands

### setup-token

**Usage:** `claude setup-token`

**Description:** Sets up a long-lived authentication token for OAuth-based authentication. Requires a Claude subscription.

```javascript
// ============================================
// setupToken - OAuth token setup wizard
// Location: chunks.157.mjs:1097-1121
// ============================================

// ORIGINAL (for source lookup):
Q.command("setup-token").description("Set up a long-lived authentication token (requires Claude subscription)").helpOption("-h, --help", "Display help for command").action(async () => {
  l("tengu_setup_token_command", {});
  await sI();  // initializeAuth
  if (!iq()) {  // hasNoExistingAuth
    process.stderr.write(I1.yellow(`Warning: You already have authentication configured via environment variable or API key helper.\n`));
    process.stderr.write(I1.yellow(`The setup-token command will create a new OAuth token which you can use instead.\n`));
  }
  await new Promise(async (X) => {
    let { unmount: I } = await Y5(K3.default.createElement(b5, {
      onChangeAppState: dp
    }, K3.default.createElement(T, {
      flexDirection: "column",
      gap: 1
    }, K3.default.createElement(ha, {
      items: [K3.default.createElement(BU1, { key: "welcome" })]
    }, (D) => D),
    K3.default.createElement(_s, {
      onDone: () => { I(); X() },
      mode: "setup-token",
      startingMessage: "This will guide you through long-lived (1-year) auth token setup for your Claude account. Claude subscription required."
    }))));
  });
  process.exit(0);
});

// Mapping: sI→initializeAuth, iq→hasNoExistingAuth, _s→AuthSetupWizard, BU1→WelcomeBanner
```

### doctor

**Usage:** `claude doctor`

**Description:** Checks the health of your Claude Code auto-updater and system configuration.

```javascript
// ============================================
// doctor - Health check command
// Location: chunks.157.mjs:1130-1142
// ============================================

// ORIGINAL (for source lookup):
Q.command("doctor").description("Check the health of your Claude Code auto-updater").helpOption("-h, --help", "Display help for command").action(async () => {
  l("tengu_doctor_command", {});
  await new Promise(async (X) => {
    let { unmount: I } = await Y5(K3.default.createElement(b5, null,
      K3.default.createElement(fE1, {
        dynamicMcpConfig: void 0,
        isStrictMcpConfig: !1
      }, K3.default.createElement(J, {
        onDone: () => { I(); X() }
      }))
    ), FY(!1));  // renderOptions
  });
  process.exit(0);
});

// Mapping: fE1→McpProvider, J→DoctorUI
```

### update

**Usage:** `claude update`

**Description:** Checks for updates and installs if available.

```javascript
// ============================================
// update - Check and install updates
// Location: chunks.157.mjs:1143
// ============================================

// ORIGINAL (for source lookup):
Q.command("update").description("Check for updates and install if available").helpOption("-h, --help", "Display help for command").action(mw9);

// Mapping: mw9→runUpdateCheck
```

### install [target]

**Usage:** `claude install [target] [--force]`

**Description:** Installs Claude Code native build. Use target to specify version.

**Arguments:**
- `[target]` - Version to install: stable, latest, or specific version

**Options:**
- `--force` - Force installation even if already installed

```javascript
// ============================================
// install - Install native build
// Location: chunks.157.mjs:1143-1151
// ============================================

// ORIGINAL (for source lookup):
Q.command("install [target]").description("Install Claude Code native build. Use [target] to specify version (stable, latest, or specific version)").option("--force", "Force installation even if already installed").helpOption("-h, --help", "Display help for command").action(async (X, I) => {
  await IU1(qy0(), "default", !1, !1, void 0);  // initializeWorkspace
  await new Promise((D) => {
    let W = [];
    if (X) W.push(X);
    if (I.force) W.push("--force");
    lw9.call((K) => {  // runInstaller
      D();
      process.exit(K.includes("failed") ? 1 : 0);
    }, {}, W);
  });
});

// Mapping: IU1→initializeWorkspace, qy0→getWorkingDirectory, lw9→runInstaller
```

---

## Configuration Scopes

The following scopes are used for MCP servers and plugins:

| Scope | Location | Priority | Description |
|-------|----------|----------|-------------|
| `local` | `.claude/settings.local.json` | Highest | Machine-specific, not committed |
| `project` | `.claude/settings.json` | Medium | Project-specific, shared |
| `user` | `~/.claude/settings.json` | Lowest | User-wide settings |

**Precedence:** local > project > user

---

## Telemetry Events

All subcommands emit telemetry events:

| Command | Event |
|---------|-------|
| `mcp serve` | `tengu_mcp_start` |
| `mcp list` | `tengu_mcp_list` |
| `mcp get` | `tengu_mcp_get` |
| `mcp add-json` | `tengu_mcp_add` |
| `mcp add-from-claude-desktop` | `tengu_mcp_add` |
| `mcp remove` | `tengu_mcp_delete` |
| `mcp reset-project-choices` | `tengu_mcp_reset_mcpjson_choices` |
| `plugin install` | `tengu_plugin_install_command` |
| `plugin uninstall` | `tengu_plugin_uninstall_command` |
| `plugin enable` | `tengu_plugin_enable_command` |
| `plugin disable` | `tengu_plugin_disable_command` |
| `plugin update` | `tengu_plugin_update_command` |
| `marketplace add` | `tengu_marketplace_added` |
| `marketplace remove` | `tengu_marketplace_removed` |
| `marketplace update` | `tengu_marketplace_updated` |
| `setup-token` | `tengu_setup_token_command` |
| `doctor` | `tengu_doctor_command` |
