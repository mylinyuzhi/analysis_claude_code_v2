# Plugin System Schemas

> All Zod schemas defining plugin manifest, marketplace, and installation data structures.
>
> **Related Symbols:** See [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Plugin System section

---

## Quick Navigation

- [Plugin Manifest Schema](#plugin-manifest-schema-naa)
- [Marketplace Schema](#marketplace-schema-tia)
- [Marketplace Entry Schema](#marketplace-entry-schema-g85)
- [Plugin Source Schema](#plugin-source-schema-b85)
- [Marketplace Source Schema](#marketplace-source-schema-eq1)
- [Installed Plugins V1 Schema](#installed-plugins-v1-schema-la)
- [Installed Plugins V2 Schema](#installed-plugins-v2-schema-ab1)
- [Plugin ID Schema](#plugin-id-schema-iaa)
- [DXT Manifest Schema](#dxt-manifest-schema-wb1)

---

## Plugin Manifest Schema (`nAA`)

> **Location:** chunks.94.mjs:2529-2538
> **Purpose:** Validates plugin.json files that define plugin metadata and components

### Schema Structure

```javascript
// ============================================
// pluginManifestSchema - Plugin manifest validation
// Location: chunks.94.mjs:2529-2538
// ============================================

// ORIGINAL (for source lookup):
nAA = j.object({
  ...i45.shape,
  ...n45.partial().shape,
  ...s45.partial().shape,
  ...r45.partial().shape,
  ...o45.partial().shape,
  ...t45.partial().shape,
  ...e45.partial().shape,
  ...Q85.partial().shape
}).strict()

// READABLE (for understanding):
pluginManifestSchema = z.object({
  // Required: Base info (from i45)
  name: z.string().min(1).refine(noSpaces).describe("Unique plugin identifier"),
  version: z.string().optional().describe("Semantic version"),
  description: z.string().optional(),
  author: authorSchema.optional(),
  homepage: z.string().url().optional(),
  repository: z.string().optional(),
  license: z.string().optional(),
  keywords: z.array(z.string()).optional(),

  // Optional: Hooks (from n45)
  hooks: z.union([
    pathToJsonFile,
    hooksDefinition,
    z.array(z.union([pathToJsonFile, hooksDefinition]))
  ]).optional(),

  // Optional: Commands (from s45)
  commands: z.union([
    pathToCommandFile,
    z.array(pathToCommandFile),
    z.record(z.string(), commandMetadataSchema)
  ]).optional(),

  // Optional: Agents (from r45)
  agents: z.union([
    pathToAgentFile,
    z.array(pathToAgentFile)
  ]).optional(),

  // Optional: Skills (from o45)
  skills: z.union([
    pathToSkillDir,
    z.array(pathToSkillDir)
  ]).optional(),

  // Optional: Output Styles (from t45)
  outputStyles: z.union([
    pathToStylesDir,
    z.array(pathToStylesDir)
  ]).optional(),

  // Optional: MCP Servers (from e45)
  mcpServers: z.union([
    pathToMcpJson,
    pathToMcpbFile,
    z.record(z.string(), mcpServerConfig),
    z.array(mcpServerVariants)
  ]).optional(),

  // Optional: LSP Servers (from Q85)
  lspServers: z.union([
    pathToLspJson,
    z.record(z.string(), lspServerConfig),
    z.array(lspServerVariants)
  ]).optional()
}).strict()

// Mapping: nAA→pluginManifestSchema, i45→baseInfoSchema, n45→hooksSchema,
//          s45→commandsSchema, r45→agentsSchema, o45→skillsSchema,
//          t45→outputStylesSchema, e45→mcpServersSchema, Q85→lspServersSchema
```

### Base Info Schema (`i45`)

```javascript
// ============================================
// baseInfoSchema - Required plugin metadata
// Location: chunks.94.mjs:2470-2481
// ============================================

// ORIGINAL (for source lookup):
i45 = j.object({
  name: j.string().min(1, "Plugin name cannot be empty").refine((A) => !A.includes(" "), {
    message: 'Plugin name cannot contain spaces. Use kebab-case (e.g., "my-plugin")'
  }).describe("Unique identifier for the plugin"),
  version: j.string().optional().describe("Semantic version"),
  description: j.string().optional().describe("Brief explanation"),
  author: y22.optional().describe("Plugin creator info"),
  homepage: j.string().url().optional(),
  repository: j.string().optional(),
  license: j.string().optional(),
  keywords: j.array(j.string()).optional()
})

// READABLE (for understanding):
baseInfoSchema = z.object({
  name: z.string()
    .min(1, "Plugin name cannot be empty")
    .refine(name => !name.includes(" "), {
      message: 'Use kebab-case (e.g., "my-plugin")'
    }),
  version: z.string().optional(),       // semver format
  description: z.string().optional(),
  author: authorSchema.optional(),       // { name, email?, url? }
  homepage: z.string().url().optional(),
  repository: z.string().optional(),
  license: z.string().optional(),        // SPDX identifier
  keywords: z.array(z.string()).optional()
})

// Mapping: i45→baseInfoSchema, y22→authorSchema
```

### Command Metadata Schema (`a45`)

```javascript
// ============================================
// commandMetadataSchema - Individual command definition
// Location: chunks.94.mjs:2486-2495
// ============================================

// ORIGINAL (for source lookup):
a45 = j.object({
  source: ke1.optional().describe("Path to command markdown file"),
  content: j.string().optional().describe("Inline markdown content"),
  description: j.string().optional(),
  argumentHint: j.string().optional().describe('e.g., "[file]"'),
  model: j.string().optional(),
  allowedTools: j.array(j.string()).optional()
}).refine((A) => A.source && !A.content || !A.source && A.content, {
  message: 'Must have either "source" or "content", but not both'
})

// READABLE (for understanding):
commandMetadataSchema = z.object({
  source: pathToFile.optional(),      // Path to .md file
  content: z.string().optional(),     // Inline markdown content
  description: z.string().optional(), // Override description
  argumentHint: z.string().optional(), // e.g., "[file]"
  model: z.string().optional(),       // Default model for command
  allowedTools: z.array(z.string()).optional() // Tool whitelist
}).refine(
  cmd => (cmd.source && !cmd.content) || (!cmd.source && cmd.content),
  { message: 'Must have source OR content, not both' }
)

// Mapping: a45→commandMetadataSchema, ke1→pathToFile
```

---

## Marketplace Schema (`TIA`)

> **Location:** chunks.94.mjs:2591-2602
> **Purpose:** Validates marketplace.json files that list available plugins

### Schema Structure

```javascript
// ============================================
// marketplaceSchema - Marketplace manifest validation
// Location: chunks.94.mjs:2591-2602
// ============================================

// ORIGINAL (for source lookup):
TIA = j.object({
  name: j.string().min(1, "Marketplace must have a name").refine((A) => !A.includes(" "), {
    message: 'Use kebab-case (e.g., "my-marketplace")'
  }),
  owner: y22.describe("Marketplace maintainer information"),
  plugins: j.array(G85).describe("Collection of available plugins"),
  metadata: j.object({
    pluginRoot: j.string().optional().describe("Base path for relative sources"),
    version: j.string().optional(),
    description: j.string().optional()
  }).optional()
})

// READABLE (for understanding):
marketplaceSchema = z.object({
  name: z.string()
    .min(1, "Marketplace must have a name")
    .refine(name => !name.includes(" "), {
      message: 'Use kebab-case (e.g., "my-marketplace")'
    }),

  owner: authorSchema,  // { name, email?, url? }

  plugins: z.array(marketplaceEntrySchema),  // Array of plugin entries

  metadata: z.object({
    pluginRoot: z.string().optional(),  // Base path for relative plugin sources
    version: z.string().optional(),
    description: z.string().optional()
  }).optional()
})

// Mapping: TIA→marketplaceSchema, y22→authorSchema, G85→marketplaceEntrySchema
```

### Example marketplace.json

```json
{
  "name": "claude-plugins-official",
  "owner": {
    "name": "Anthropic",
    "url": "https://anthropic.com"
  },
  "plugins": [
    {
      "name": "code-formatter",
      "description": "Auto-format code with multiple language support",
      "source": "./plugins/code-formatter",
      "category": "development",
      "tags": ["formatting", "linting"]
    },
    {
      "name": "github-integration",
      "source": {
        "source": "github",
        "repo": "anthropic/claude-github-plugin"
      }
    }
  ],
  "metadata": {
    "version": "1.0.0",
    "description": "Official Claude Code plugins"
  }
}
```

---

## Marketplace Entry Schema (`G85`)

> **Location:** chunks.94.mjs:2583-2591
> **Purpose:** Defines a single plugin entry within a marketplace

### Schema Structure

```javascript
// ============================================
// marketplaceEntrySchema - Plugin entry in marketplace
// Location: chunks.94.mjs:2583-2591
// ============================================

// ORIGINAL (for source lookup):
G85 = nAA.partial().extend({
  name: j.string().min(1, "Plugin name cannot be empty").refine((A) => !A.includes(" "), {
    message: 'Use kebab-case'
  }).describe("Unique identifier"),
  source: B85.describe("Where to fetch the plugin from"),
  category: j.string().optional().describe('e.g., "productivity", "development"'),
  tags: j.array(j.string()).optional().describe("Tags for searchability"),
  strict: j.boolean().optional().default(!0).describe("Require manifest in plugin folder")
}).strict()

// READABLE (for understanding):
marketplaceEntrySchema = pluginManifestSchema.partial().extend({
  // Required
  name: z.string()
    .min(1)
    .refine(noSpaces, { message: 'Use kebab-case' }),

  source: pluginSourceSchema,  // Where to get the plugin

  // Optional marketplace metadata
  category: z.string().optional(),  // e.g., "productivity"
  tags: z.array(z.string()).optional(),
  strict: z.boolean().default(true)  // Require plugin.json in plugin folder
}).strict()

// Mapping: G85→marketplaceEntrySchema, nAA→pluginManifestSchema, B85→pluginSourceSchema
```

**Key insight:** Marketplace entries extend the plugin manifest schema (partial) so they can include manifest fields directly. The `strict` flag determines whether the plugin must have its own plugin.json or if the marketplace entry provides the manifest.

---

## Plugin Source Schema (`B85`)

> **Location:** chunks.94.mjs:2565-2583
> **Purpose:** Defines where to fetch a plugin from (multiple source types)

### Schema Structure

```javascript
// ============================================
// pluginSourceSchema - Plugin source definition
// Location: chunks.94.mjs:2565-2583
// ============================================

// ORIGINAL (for source lookup):
B85 = j.union([
  Vh.describe("Path relative to marketplace directory"),
  j.object({
    source: j.literal("npm"),
    package: v22.or(j.string()).describe("Package name"),
    version: j.string().optional(),
    registry: j.string().url().optional()
  }),
  j.object({
    source: j.literal("pip"),
    package: j.string().describe("Python package name"),
    version: j.string().optional(),
    registry: j.string().url().optional()
  }),
  j.object({
    source: j.literal("url"),
    url: j.string().endsWith(".git").describe("Git repository URL"),
    ref: j.string().optional()
  }),
  j.object({
    source: j.literal("github"),
    repo: j.string().describe("owner/repo format"),
    ref: j.string().optional()
  })
])

// READABLE (for understanding):
pluginSourceSchema = z.union([
  // Option 1: Relative path (e.g., "./plugins/my-plugin")
  z.string().startsWith("./"),

  // Option 2: NPM package
  z.object({
    source: z.literal("npm"),
    package: z.string(),            // Package name or URL
    version: z.string().optional(), // e.g., "^1.0.0"
    registry: z.string().url().optional()
  }),

  // Option 3: Python package
  z.object({
    source: z.literal("pip"),
    package: z.string(),
    version: z.string().optional(),
    registry: z.string().url().optional()
  }),

  // Option 4: Git URL
  z.object({
    source: z.literal("url"),
    url: z.string().endsWith(".git"),
    ref: z.string().optional()  // Branch or tag
  }),

  // Option 5: GitHub shorthand
  z.object({
    source: z.literal("github"),
    repo: z.string(),  // "owner/repo" format
    ref: z.string().optional()
  })
])

// Mapping: B85→pluginSourceSchema, Vh→relativePath, v22→npmPackageName
```

---

## Marketplace Source Schema (`eQ1`)

> **Location:** chunks.94.mjs:2542-2565
> **Purpose:** Defines where to fetch marketplace.json from

### Schema Structure

```javascript
// ============================================
// marketplaceSourceSchema - Where to fetch marketplace from
// Location: chunks.94.mjs:2542-2565
// ============================================

// ORIGINAL (for source lookup):
eQ1 = j.discriminatedUnion("source", [
  j.object({
    source: j.literal("url"),
    url: j.string().url().describe("Direct URL to marketplace.json"),
    headers: j.record(j.string(), j.string()).optional()
  }),
  j.object({
    source: j.literal("github"),
    repo: j.string().describe("owner/repo format"),
    ref: j.string().optional(),
    path: j.string().optional()
  }),
  j.object({
    source: j.literal("git"),
    url: j.string().endsWith(".git"),
    ref: j.string().optional(),
    path: j.string().optional()
  }),
  j.object({
    source: j.literal("npm"),
    package: v22.describe("NPM package containing marketplace.json")
  }),
  j.object({
    source: j.literal("file"),
    path: j.string().describe("Local file path")
  }),
  j.object({
    source: j.literal("directory"),
    path: j.string().describe("Directory containing .claude-plugin/marketplace.json")
  })
])

// READABLE (for understanding):
marketplaceSourceSchema = z.discriminatedUnion("source", [
  // URL source - direct HTTP(S) URL
  z.object({
    source: z.literal("url"),
    url: z.string().url(),
    headers: z.record(z.string(), z.string()).optional()  // Auth headers
  }),

  // GitHub source - repository shorthand
  z.object({
    source: z.literal("github"),
    repo: z.string(),  // "owner/repo"
    ref: z.string().optional(),  // Branch/tag
    path: z.string().optional()  // Path in repo (defaults to .claude-plugin/marketplace.json)
  }),

  // Git source - full git URL
  z.object({
    source: z.literal("git"),
    url: z.string().endsWith(".git"),
    ref: z.string().optional(),
    path: z.string().optional()
  }),

  // NPM source - package containing marketplace
  z.object({
    source: z.literal("npm"),
    package: z.string()
  }),

  // File source - local file path
  z.object({
    source: z.literal("file"),
    path: z.string()
  }),

  // Directory source - local directory
  z.object({
    source: z.literal("directory"),
    path: z.string()
  })
])

// Mapping: eQ1→marketplaceSourceSchema, v22→npmPackageName
```

---

## Installed Plugins V1 Schema (`$LA`)

> **Location:** chunks.94.mjs:2614-2617
> **Purpose:** Schema for installed_plugins.json (version 1)

### Schema Structure

```javascript
// ============================================
// installedPluginsV1Schema - V1 installed plugins registry
// Location: chunks.94.mjs:2614-2617
// ============================================

// ORIGINAL (for source lookup):
$LA = j.object({
  version: j.literal(1).describe("Schema version 1"),
  plugins: j.record(iAA, Z85).describe("Map of plugin IDs to metadata")
})

// Installation entry schema
Z85 = j.object({
  version: j.string().describe("Installed version"),
  installedAt: j.string().describe("ISO 8601 timestamp"),
  lastUpdated: j.string().optional(),
  installPath: j.string().describe("Absolute path to plugin"),
  gitCommitSha: j.string().optional(),
  isLocal: j.boolean().optional().describe("True if in marketplace directory")
})

// READABLE (for understanding):
installedPluginsV1Schema = z.object({
  version: z.literal(1),
  plugins: z.record(
    pluginIdSchema,  // "plugin-name@marketplace-name"
    installEntryV1Schema
  )
})

installEntryV1Schema = z.object({
  version: z.string(),
  installedAt: z.string(),   // ISO 8601
  lastUpdated: z.string().optional(),
  installPath: z.string(),   // Absolute path
  gitCommitSha: z.string().optional(),
  isLocal: z.boolean().optional()
})

// Mapping: $LA→installedPluginsV1Schema, Z85→installEntryV1Schema, iAA→pluginIdSchema
```

### Example installed_plugins.json (V1)

```json
{
  "version": 1,
  "plugins": {
    "code-formatter@claude-plugins-official": {
      "version": "1.2.0",
      "installedAt": "2024-01-15T10:30:00Z",
      "lastUpdated": "2024-02-01T14:22:00Z",
      "installPath": "/Users/user/.claude/plugins/cache/claude-plugins-official/code-formatter/1.2.0",
      "gitCommitSha": "abc123def456"
    }
  }
}
```

---

## Installed Plugins V2 Schema (`AB1`)

> **Location:** chunks.94.mjs:2626-2629
> **Purpose:** Schema for installed_plugins_v2.json (version 2, with scopes)

### Schema Structure

```javascript
// ============================================
// installedPluginsV2Schema - V2 versioned plugins registry
// Location: chunks.94.mjs:2626-2629
// ============================================

// ORIGINAL (for source lookup):
AB1 = j.object({
  version: j.literal(2).describe("Schema version 2"),
  plugins: j.record(iAA, j.array(Y85)).describe("Map of plugin IDs to installation arrays")
})

// Installation scope enum
I85 = j.enum(["managed", "user", "project", "local"])

// Installation entry schema
Y85 = j.object({
  scope: I85.describe("Installation scope"),
  projectPath: j.string().optional().describe("Required for project/local scopes"),
  installPath: j.string().describe("Absolute path to versioned plugin"),
  version: j.string().optional(),
  installedAt: j.string().optional(),
  lastUpdated: j.string().optional(),
  gitCommitSha: j.string().optional(),
  isLocal: j.boolean().optional()
})

// READABLE (for understanding):
installScopeEnum = z.enum(["managed", "user", "project", "local"])

installEntryV2Schema = z.object({
  scope: installScopeEnum,
  projectPath: z.string().optional(),  // Required for project/local
  installPath: z.string(),
  version: z.string().optional(),
  installedAt: z.string().optional(),
  lastUpdated: z.string().optional(),
  gitCommitSha: z.string().optional(),
  isLocal: z.boolean().optional()
})

installedPluginsV2Schema = z.object({
  version: z.literal(2),
  plugins: z.record(
    pluginIdSchema,
    z.array(installEntryV2Schema)  // Array allows multiple installations
  )
})

// Mapping: AB1→installedPluginsV2Schema, Y85→installEntryV2Schema, I85→installScopeEnum
```

### Installation Scopes

| Scope | Description | projectPath Required |
|-------|-------------|---------------------|
| `managed` | Enterprise/policy managed | No |
| `user` | User-level installation (~/.claude) | No |
| `project` | Project-specific installation | Yes |
| `local` | Local development (in marketplace dir) | Yes |

**Key insight:** V2 schema allows the same plugin to be installed at multiple scopes with different versions, enabling project-specific plugin configurations.

---

## Plugin ID Schema (`iAA`)

> **Location:** chunks.94.mjs:2602
> **Purpose:** Validates plugin ID format

```javascript
// ============================================
// pluginIdSchema - Plugin identifier validation
// Location: chunks.94.mjs:2602
// ============================================

// ORIGINAL (for source lookup):
iAA = j.string().regex(/^[a-z0-9][-a-z0-9._]*@[a-z0-9][-a-z0-9._]*$/i,
  "Plugin ID must be in format: plugin@marketplace")

// READABLE (for understanding):
pluginIdSchema = z.string().regex(
  /^[a-z0-9][-a-z0-9._]*@[a-z0-9][-a-z0-9._]*$/i,
  "Plugin ID must be in format: plugin@marketplace"
)

// Examples:
// Valid: "code-formatter@claude-plugins-official"
// Valid: "my-plugin@my-marketplace"
// Invalid: "plugin" (missing @marketplace)
// Invalid: "plugin@" (empty marketplace)

// Mapping: iAA→pluginIdSchema
```

---

## DXT Manifest Schema (`WB1`)

> **Location:** chunks.95.mjs:1838-1864
> **Purpose:** Validates .dxt or .mcpb files for MCP server configuration

```javascript
// ============================================
// dxtManifestSchema - DXT/MCPB manifest validation
// Location: chunks.95.mjs:1838-1864
// ============================================

// ORIGINAL (for source lookup):
WB1 = Qw({
  $schema: CQ().optional(),
  dxt_version: CQ().optional().describe("@deprecated Use manifest_version"),
  manifest_version: CQ().optional(),
  name: CQ(),
  display_name: CQ().optional(),
  version: CQ(),
  description: CQ(),
  long_description: CQ().optional(),
  author: u85,
  repository: m85.optional(),
  homepage: CQ().url().optional(),
  documentation: CQ().url().optional(),
  support: CQ().url().optional(),
  icon: CQ().optional(),
  screenshots: zJ(CQ()).optional(),
  server: p85,  // MCP server config
  tools: zJ(i85).optional(),
  tools_generated: $F().optional(),
  prompts: zJ(n85).optional(),
  prompts_generated: $F().optional(),
  keywords: zJ(CQ()).optional(),
  license: CQ().optional(),
  privacy_policies: zJ(CQ()).optional(),
  compatibility: l85.optional(),
  user_config: PR(CQ(), a85).optional()
}).refine((A) => !!(A.dxt_version || A.manifest_version), {
  message: "Either 'dxt_version' or 'manifest_version' must be provided"
})

// READABLE (for understanding):
dxtManifestSchema = z.object({
  // Schema metadata
  $schema: z.string().optional(),
  dxt_version: z.string().optional(),   // Deprecated
  manifest_version: z.string().optional(),

  // Basic info
  name: z.string(),
  display_name: z.string().optional(),
  version: z.string(),
  description: z.string(),
  long_description: z.string().optional(),

  // Author/ownership
  author: authorSchema,
  repository: repoSchema.optional(),
  homepage: z.string().url().optional(),
  documentation: z.string().url().optional(),
  support: z.string().url().optional(),

  // Visual
  icon: z.string().optional(),
  screenshots: z.array(z.string()).optional(),

  // Server configuration
  server: mcpServerSchema,  // { type, entry_point, mcp_config }

  // Capabilities
  tools: z.array(toolSchema).optional(),
  tools_generated: z.boolean().optional(),
  prompts: z.array(promptSchema).optional(),
  prompts_generated: z.boolean().optional(),

  // Metadata
  keywords: z.array(z.string()).optional(),
  license: z.string().optional(),
  privacy_policies: z.array(z.string()).optional(),
  compatibility: compatibilitySchema.optional(),
  user_config: z.record(z.string(), configFieldSchema).optional()
}).refine(
  m => !!(m.dxt_version || m.manifest_version),
  { message: "Either 'dxt_version' or 'manifest_version' required" }
)

// Mapping: WB1→dxtManifestSchema, u85→authorSchema, p85→mcpServerSchema
```

---

## Schema Relationships

```
                    ┌─────────────────────────────────────┐
                    │       marketplaceSourceSchema       │
                    │              (eQ1)                  │
                    │  url | github | git | npm | file   │
                    └───────────────┬─────────────────────┘
                                    │ fetches
                                    ▼
┌───────────────────────────────────────────────────────────────┐
│                    marketplaceSchema (TIA)                     │
│  { name, owner, plugins: [marketplaceEntrySchema], metadata } │
└──────────────────────────────┬────────────────────────────────┘
                               │ contains
                               ▼
┌───────────────────────────────────────────────────────────────┐
│                 marketplaceEntrySchema (G85)                   │
│        extends pluginManifestSchema.partial()                  │
│        + { name, source, category, tags, strict }             │
└──────────────────────────────┬────────────────────────────────┘
                               │ references
                               ▼
┌───────────────────────────────────────────────────────────────┐
│                   pluginSourceSchema (B85)                     │
│      path | npm | pip | url | github                          │
└──────────────────────────────┬────────────────────────────────┘
                               │ fetches
                               ▼
┌───────────────────────────────────────────────────────────────┐
│                  pluginManifestSchema (nAA)                    │
│  { name, version, hooks, commands, agents, skills,            │
│    outputStyles, mcpServers, lspServers }                     │
└──────────────────────────────┬────────────────────────────────┘
                               │ installs to
                               ▼
┌───────────────────────────────────────────────────────────────┐
│    installedPluginsV1Schema ($LA) / V2Schema (AB1)            │
│    { version: 1|2, plugins: { "id@market": entry } }          │
└───────────────────────────────────────────────────────────────┘
```

---

## Related Files

- [overview.md](./overview.md) - Plugin system architecture
- [marketplace.md](./marketplace.md) - Marketplace management
- [installation.md](./installation.md) - Plugin installation flow
- [loading.md](./loading.md) - Plugin component loading
- [state_management.md](./state_management.md) - Enable/disable state
- [slash_command.md](./slash_command.md) - `/plugin` command

---

## Key Symbols Summary

| Obfuscated | Readable | Type |
|------------|----------|------|
| `nAA` | pluginManifestSchema | constant |
| `TIA` | marketplaceSchema | constant |
| `G85` | marketplaceEntrySchema | constant |
| `B85` | pluginSourceSchema | constant |
| `eQ1` | marketplaceSourceSchema | constant |
| `$LA` | installedPluginsV1Schema | constant |
| `AB1` | installedPluginsV2Schema | constant |
| `iAA` | pluginIdSchema | constant |
| `WB1` | dxtManifestSchema | constant |
| `i45` | baseInfoSchema | constant |
| `a45` | commandMetadataSchema | constant |
| `Z85` | installEntryV1Schema | constant |
| `Y85` | installEntryV2Schema | constant |
| `I85` | installScopeEnum | constant |
