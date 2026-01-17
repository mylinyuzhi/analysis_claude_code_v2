# Plugin Schemas & Validation

> Zod schemas for plugin system data structures.
>
> **Related Symbols:** See symbol index files:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

---

## Quick Navigation

- [Plugin Manifest Schema](#plugin-manifest-schema)
- [Marketplace Schema](#marketplace-schema)
- [Plugin Source Schema](#plugin-source-schema)
- [Installed Plugins Registry](#installed-plugins-registry)
- [Hooks File Schema](#hooks-file-schema)
- [Error Types](#error-types)

---

## Plugin Manifest Schema

The `plugin.json` file in `.claude-plugin/` directory.

```javascript
// ============================================
// pluginManifestSchema - Plugin manifest validation
// Location: chunks.130.mjs
// ============================================

// READABLE schema definition:
const pluginManifestSchema = z.object({
  // Required fields
  name: z.string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Plugin name must be lowercase, alphanumeric with hyphens"),

  // Optional fields
  version: z.string().optional(),
  description: z.string().optional(),

  // Commands - multiple formats supported
  commands: z.union([
    z.string(),                     // Single path: "commands/"
    z.array(z.string()),            // Multiple paths: ["commands/", "extra-commands/"]
    z.record(z.object({             // Object with metadata:
      source: z.string().optional(),
      content: z.string().optional(),
      description: z.string().optional()
    }))
  ]).optional(),

  // Agents
  agents: z.union([
    z.string(),
    z.array(z.string())
  ]).optional(),

  // Skills
  skills: z.union([
    z.string(),
    z.array(z.string())
  ]).optional(),

  // Hooks
  hooks: z.union([
    z.string(),
    z.array(z.string()),
    z.object({})  // Inline hook config
  ]).optional(),

  // Output styles
  outputStyles: z.union([
    z.string(),
    z.array(z.string())
  ]).optional(),

  // LSP servers (v2.1.7+)
  lspServers: z.record(z.object({
    command: z.string(),
    args: z.array(z.string()).optional(),
    env: z.record(z.string()).optional()
  })).optional()
}).strict();

// Example valid manifest:
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "My custom plugin",
  "commands": {
    "my-cmd": {
      "source": "./commands/my-cmd.md",
      "description": "My custom command"
    }
  },
  "skills": ["./skills"],
  "hooks": ["./hooks/hooks.json"]
}
```

---

## Marketplace Schema

The `marketplace.json` file for plugin collections.

```javascript
// ============================================
// marketplaceJsonSchema - Marketplace manifest validation
// Location: chunks.91.mjs:93
// ============================================

// READABLE schema definition:
const marketplaceJsonSchema = z.object({
  // Required fields
  name: z.string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Marketplace name must be lowercase"),

  // Optional fields
  description: z.string().optional(),
  author: z.string().optional(),
  url: z.string().url().optional(),

  // Plugin entries
  plugins: z.array(z.object({
    // Required
    name: z.string(),

    // Optional metadata
    description: z.string().optional(),
    version: z.string().optional(),
    author: z.string().optional(),

    // Source - where to get the plugin
    source: z.union([
      z.string(),                    // Relative path: "./plugins/my-plugin"
      pluginSourceSchema             // Source object
    ]),

    // Additional metadata
    tags: z.array(z.string()).optional(),
    license: z.string().optional()
  }))
}).strict();

// Example marketplace.json:
{
  "name": "my-marketplace",
  "description": "My custom plugin collection",
  "plugins": [
    {
      "name": "plugin-a",
      "description": "Plugin A",
      "version": "1.0.0",
      "source": "./plugins/plugin-a"
    },
    {
      "name": "plugin-b",
      "description": "Plugin B from GitHub",
      "source": {
        "source": "github",
        "repo": "owner/plugin-b"
      }
    }
  ]
}

// Mapping: JVA→marketplaceJsonSchema
```

---

## Plugin Source Schema

Defines where a plugin can be fetched from.

```javascript
// ============================================
// pluginSourceSchema - Plugin source type definitions
// Location: chunks.91.mjs
// ============================================

// READABLE schema definition:
const pluginSourceSchema = z.discriminatedUnion("source", [
  // GitHub repository
  z.object({
    source: z.literal("github"),
    repo: z.string().regex(/^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/),
    ref: z.string().optional()    // Branch or tag
  }),

  // Git URL
  z.object({
    source: z.literal("git"),
    url: z.string(),
    ref: z.string().optional()
  }),

  // Direct URL to JSON
  z.object({
    source: z.literal("url"),
    url: z.string().url(),
    headers: z.record(z.string()).optional()
  }),

  // Local file path
  z.object({
    source: z.literal("file"),
    path: z.string()
  }),

  // Local directory
  z.object({
    source: z.literal("directory"),
    path: z.string()
  }),

  // NPM package (not yet implemented)
  z.object({
    source: z.literal("npm"),
    package: z.string()
  })
]);

// GitHub default branch variant
const marketplaceSourceSchema = z.discriminatedUnion("source", [
  z.object({
    source: z.literal("github-default-branch"),
    repo: z.string().regex(/^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/),
    path: z.string().optional()   // Path to marketplace.json
  }),
  ...pluginSourceSchema.options
]);

// Examples:
// GitHub: { source: "github", repo: "owner/repo", ref: "v1.0.0" }
// Git: { source: "git", url: "git@example.com:repo.git", ref: "main" }
// File: { source: "file", path: "/path/to/plugin" }
// Directory: { source: "directory", path: "/path/to/dir" }
```

---

## Installed Plugins Registry

### V1 Schema (Legacy)

```javascript
// ============================================
// installedPluginsV1Schema - Legacy registry format
// Location: chunks.91.mjs
// ============================================

// File: ~/.claude/installed_plugins.json
const installedPluginsV1Schema = z.object({
  version: z.literal(1),
  plugins: z.record(z.object({
    version: z.string(),
    installedAt: z.string().datetime(),
    lastUpdated: z.string().datetime().optional(),
    installPath: z.string(),
    gitCommitSha: z.string().optional()
  }))
});

// Example:
{
  "version": 1,
  "plugins": {
    "my-plugin@my-marketplace": {
      "version": "1.0.0",
      "installedAt": "2024-01-15T10:30:00Z",
      "installPath": "~/.claude/plugins/cache/my-marketplace/my-plugin/1.0.0"
    }
  }
}
```

### V2 Schema (Current)

```javascript
// ============================================
// installedPluginsV2Schema - Current registry format with scopes
// Location: chunks.91.mjs
// ============================================

// File: ~/.claude/installed_plugins_v2.json
const installedPluginsV2Schema = z.object({
  version: z.literal(2),
  plugins: z.record(z.array(z.object({
    // Installation scope
    scope: z.enum(["managed", "user", "project", "local"]),

    // Installation details
    version: z.string(),
    installPath: z.string(),
    installedAt: z.string().datetime(),
    lastUpdated: z.string().datetime().optional(),

    // Git info (for git-based sources)
    gitCommitSha: z.string().optional(),

    // Project path (for project scope)
    projectPath: z.string().optional()
  })))
});

// Example:
{
  "version": 2,
  "plugins": {
    "my-plugin@my-marketplace": [
      {
        "scope": "user",
        "version": "1.0.0",
        "installPath": "~/.claude/plugins/cache/my-marketplace/my-plugin/1.0.0",
        "installedAt": "2024-01-15T10:30:00Z",
        "lastUpdated": "2024-02-01T14:22:00Z",
        "gitCommitSha": "abc123def456789..."
      },
      {
        "scope": "project",
        "version": "2.0.0",
        "installPath": "/project/.claude/plugins/my-marketplace/my-plugin/2.0.0",
        "installedAt": "2024-02-01T14:22:00Z",
        "projectPath": "/project"
      }
    ]
  }
}
```

### Scope Types

| Scope | Description | Location |
|-------|-------------|----------|
| `managed` | Enterprise/policy installed | Policy directory |
| `user` | User-level installation | `~/.claude/plugins/cache/` |
| `project` | Project-specific | `.claude/plugins/` |
| `local` | Local development | Marketplace directory |

---

## Known Marketplaces Config

```javascript
// ============================================
// knownMarketplacesSchema - Marketplace configuration
// Location: chunks.90.mjs
// ============================================

// File: ~/.claude/plugins/known_marketplaces.json
const knownMarketplacesSchema = z.record(z.object({
  source: marketplaceSourceSchema,
  installLocation: z.string(),
  lastUpdated: z.string().datetime(),
  autoUpdate: z.boolean().optional()
}));

// Example:
{
  "my-marketplace": {
    "source": {
      "source": "github-default-branch",
      "repo": "owner/marketplace-repo"
    },
    "installLocation": "~/.claude/plugins/marketplaces/my-marketplace",
    "lastUpdated": "2024-01-15T10:30:00Z",
    "autoUpdate": true
  }
}
```

---

## Hooks File Schema

```javascript
// ============================================
// hooksFileSchema - Plugin hooks.json validation
// Location: chunks.130.mjs
// ============================================

// READABLE schema definition:
const hookEntrySchema = z.object({
  type: z.enum(["command", "url"]),
  command: z.string().optional(),       // For type: "command"
  url: z.string().url().optional(),     // For type: "url"
  timeout: z.number().optional(),
  retries: z.number().optional()
});

const hooksFileSchema = z.object({
  hooks: z.object({
    PreToolUse: z.array(hookEntrySchema).optional(),
    PostToolUse: z.array(hookEntrySchema).optional(),
    PreMessage: z.array(hookEntrySchema).optional(),
    PostMessage: z.array(hookEntrySchema).optional(),
    Stop: z.array(hookEntrySchema).optional()
  })
});

// Example hooks.json:
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "command": "./validate.sh ${tool_name}"
      }
    ],
    "PostToolUse": [
      {
        "type": "url",
        "url": "https://api.example.com/hook",
        "timeout": 5000
      }
    ]
  }
}

// Mapping: l62→hooksFileSchema
```

---

## Error Types

Plugin loading errors have specific types for debugging.

```javascript
// ============================================
// Plugin error types
// Location: chunks.91.mjs (referenced in error handling)
// ============================================

type PluginError =
  // Plugin not found in marketplace
  | { type: "plugin-not-found"; source: string; pluginId: string; marketplace: string }

  // Marketplace not found
  | { type: "marketplace-not-found"; source: string; marketplace: string }

  // Failed to load/parse marketplace
  | { type: "marketplace-load-failed"; source: string; error: string }

  // Enterprise policy blocks marketplace
  | { type: "marketplace-blocked-by-policy"; source: string; plugin: string; marketplace: string; blockedByBlocklist: boolean; allowedSources: string[] }

  // Component file/directory not found
  | { type: "path-not-found"; source: string; plugin: string; path: string; component: "commands" | "agents" | "skills" | "hooks" | "output-styles" }

  // Failed to load/parse hook file
  | { type: "hook-load-failed"; source: string; plugin: string; hookPath: string; reason: string }

  // Failed to load component
  | { type: "component-load-failed"; source: string; plugin: string; component: string; error: string }

  // Invalid LSP server config
  | { type: "lsp-config-invalid"; source: string; plugin: string; serverName: string; error: string }

  // LSP server failed to start
  | { type: "lsp-server-start-failed"; source: string; plugin: string; serverName: string; error: string }

  // Generic error
  | { type: "generic-error"; source: string; error: string }
```

### Error Handling Pattern

```javascript
// READABLE error handling pattern:
function formatPluginError(error) {
  switch (error.type) {
    case "plugin-not-found":
      return `Plugin '${error.pluginId}' not found in marketplace '${error.marketplace}'`;

    case "marketplace-blocked-by-policy":
      if (error.blockedByBlocklist) {
        return `Marketplace '${error.marketplace}' is blocked by enterprise policy`;
      }
      return `Marketplace '${error.marketplace}' is not in the allowed list. Allowed: ${error.allowedSources.join(", ")}`;

    case "path-not-found":
      return `${error.component} path not found for plugin '${error.plugin}': ${error.path}`;

    case "hook-load-failed":
      return `Failed to load hooks for '${error.plugin}': ${error.reason}`;

    default:
      return error.error || "Unknown error";
  }
}
```

---

## Plugin ID Schema

```javascript
// ============================================
// pluginIdSchema - Plugin ID format validation
// Location: chunks.91.mjs
// ============================================

// Plugin ID format: "plugin-name@marketplace-name"
const pluginIdSchema = z.string().regex(
  /^[a-z0-9-]+@[a-z0-9-]+$/,
  "Plugin ID must be in format: plugin-name@marketplace-name"
);

// Examples:
// Valid: "my-plugin@my-marketplace"
// Valid: "code-formatter@official"
// Invalid: "MyPlugin@Official" (must be lowercase)
// Invalid: "plugin" (missing @marketplace)

// Mapping: W4A→pluginIdSchema
```

---

## Key Symbols Summary

| Obfuscated | Readable | Location | Type |
|------------|----------|----------|------|
| - | pluginManifestSchema | chunks.130.mjs | constant |
| `JVA` | marketplaceJsonSchema | chunks.91.mjs:93 | constant |
| - | pluginSourceSchema | chunks.91.mjs | constant |
| - | marketplaceSourceSchema | chunks.91.mjs | constant |
| - | installedPluginsV1Schema | chunks.91.mjs | constant |
| - | installedPluginsV2Schema | chunks.91.mjs | constant |
| `l62` | hooksFileSchema | chunks.130.mjs | constant |
| `W4A` | pluginIdSchema | chunks.91.mjs | constant |
| `J32` | parseAndValidateSchema | chunks.91.mjs:7 | function |
| `Hq` | SchemaValidationError | chunks.91.mjs | class |

---

## Related Files

- [overview.md](./overview.md) - Plugin system architecture
- [installation.md](./installation.md) - Plugin installation
- [marketplace.md](./marketplace.md) - Marketplace management
- [state_management.md](./state_management.md) - Enable/disable state
