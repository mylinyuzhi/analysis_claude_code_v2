/**
 * @claudecode/plugin - Plugin Schemas
 *
 * Zod schemas for plugin system validation.
 * Reconstructed from chunks.90.mjs and chunks.91.mjs.
 */

import { z } from 'zod';

// ============================================
// Helper Schemas
// ============================================

/** Original: Nd in chunks.90.mjs */
const relativeSourceSchema = z.string().startsWith('./');

/** Original: ZVA in chunks.90.mjs */
const jsonFileSchema = relativeSourceSchema.refine((val) => val.endsWith('.json'), {
  message: 'Must be a .json file',
});

/** Original: m62 in chunks.90.mjs */
const mcpbSourceSchema = z.union([
  relativeSourceSchema
    .refine((val) => val.endsWith('.mcpb') || val.endsWith('.dxt'), {
      message: 'MCPB file path must end with .mcpb or .dxt',
    })
    .describe('Path to MCPB file relative to plugin root'),
  z
    .string()
    .url()
    .refine((val) => val.endsWith('.mcpb') || val.endsWith('.dxt'), {
      message: 'MCPB URL must end with .mcpb or .dxt',
    })
    .describe('URL to MCPB file'),
]);

/** Original: XI0 in chunks.90.mjs */
const markdownFileSchema = relativeSourceSchema.refine((val) => val.endsWith('.md'), {
  message: 'Must be a .md file',
});

/** Original: II0 in chunks.90.mjs */
const commandSourceSchema = z.union([markdownFileSchema, relativeSourceSchema]);

/** Original: p62 in chunks.90.mjs */
export const authorSchema = z.object({
  name: z.string().min(1, 'Author name cannot be empty').describe('Display name of the plugin author or organization'),
  email: z.string().optional().describe('Contact email for support or feedback'),
  url: z.string().optional().describe('Website, GitHub profile, or organization URL'),
});

// ============================================
// Component Schemas
// ============================================

/** Original: V75 in chunks.90.mjs */
export const baseMetadataSchema = z.object({
  name: z
    .string()
    .min(1, 'Plugin name cannot be empty')
    .refine((val) => !val.includes(' '), {
      message: 'Plugin name cannot contain spaces. Use kebab-case (e.g., "my-plugin")',
    })
    .describe('Unique identifier for the plugin, used for namespacing (prefer kebab-case)'),
  version: z.string().optional().describe('Semantic version (e.g., 1.2.3) following semver.org specification'),
  description: z.string().optional().describe('Brief, user-facing explanation of what the plugin provides'),
  author: authorSchema.optional().describe('Information about the plugin creator or maintainer'),
  homepage: z.string().url().optional().describe('Plugin homepage or documentation URL'),
  repository: z.string().optional().describe('Source code repository URL'),
  license: z.string().optional().describe('SPDX license identifier (e.g., MIT, Apache-2.0)'),
  keywords: z.array(z.string()).optional().describe('Tags for plugin discovery and categorization'),
});

// Forward declaration for hooks to handle lazy loading
const hooksSchema = z.lazy(() => z.record(z.string(), z.array(z.any())));

/** Original: l62 in chunks.90.mjs */
export const hooksFileSchema = z.object({
  description: z.string().optional().describe('Brief, user-facing explanation of what these hooks provide'),
  hooks: hooksSchema.describe('The hooks provided by the plugin, in the same format as the one used for settings'),
});

/** Original: F75 in chunks.90.mjs */
export const hooksConfigurationSchema = z.object({
  hooks: z.union([
    jsonFileSchema.describe('Path to file with additional hooks'),
    hooksSchema.describe('Additional hooks'),
    z.array(z.union([jsonFileSchema, hooksSchema])),
  ]),
});

/** Original: H75 in chunks.90.mjs */
export const commandMetadataSchema = z
  .object({
    source: commandSourceSchema.optional().describe('Path to command markdown file, relative to plugin root'),
    content: z.string().optional().describe('Inline markdown content for the command'),
    description: z.string().optional().describe('Command description override'),
    argumentHint: z.string().optional().describe('Hint for command arguments (e.g., "[file]")'),
    model: z.string().optional().describe('Default model for this command'),
    allowedTools: z.array(z.string()).optional().describe('Tools allowed when command runs'),
  })
  .refine((val) => (val.source && !val.content) || (!val.source && val.content), {
    message: 'Command must have either "source" (file path) or "content" (inline markdown), but not both',
  });

/** Original: E75 in chunks.90.mjs */
export const commandsDefinitionSchema = z.object({
  commands: z.union([
    commandSourceSchema.describe('Path to additional command file or skill directory'),
    z.array(commandSourceSchema).describe('List of paths to additional command files or skill directories'),
    z.record(z.string(), commandMetadataSchema).describe('Object mapping of command names to their metadata'),
  ]),
});

/** Original: z75 in chunks.90.mjs */
export const agentsDefinitionSchema = z.object({
  agents: z.union([
    markdownFileSchema.describe('Path to additional agent file'),
    z.array(markdownFileSchema).describe('List of paths to additional agent files'),
  ]),
});

/** Original: $75 in chunks.90.mjs */
export const skillsDefinitionSchema = z.object({
  skills: z.union([
    relativeSourceSchema.describe('Path to additional skill directory'),
    z.array(relativeSourceSchema).describe('List of paths to additional skill directories'),
  ]),
});

/** Original: C75 in chunks.90.mjs */
export const outputStylesDefinitionSchema = z.object({
  outputStyles: z.union([
    relativeSourceSchema.describe('Path to additional output styles directory or file'),
    z.array(relativeSourceSchema).describe('List of paths to additional output styles directories or files'),
  ]),
});

/** Original: U75 in chunks.90.mjs */
export const mcpServersDefinitionSchema = z.object({
  mcpServers: z.union([
    jsonFileSchema.describe('MCP servers to include in the plugin'),
    mcpbSourceSchema.describe('Path or URL to MCPB file'),
    z.record(z.string(), z.any()).describe('MCP server configurations keyed by server name'),
    z.array(z.union([jsonFileSchema, mcpbSourceSchema, z.record(z.string(), z.any())])).describe('Array of MCP server configurations'),
  ]),
});

/** Original: YVA in chunks.90.mjs */
export const lspServerConfigSchema = z.strictObject({
  command: z
    .string()
    .min(1)
    .refine(
      (val) => {
        if (val.includes(' ') && !val.startsWith('/')) return false;
        return true;
      },
      { message: 'Command should not contain spaces. Use args array for arguments.' }
    )
    .describe('Command to execute the LSP server'),
  args: z.array(z.string().min(1)).optional().describe('Command-line arguments to pass to the server'),
  extensionToLanguage: z
    .record(
      z.string().min(2).refine((val) => val.startsWith('.'), { message: 'File extensions must start with dot' }),
      z.string().min(1)
    )
    .refine((val) => Object.keys(val).length > 0, { message: 'extensionToLanguage must have at least one mapping' })
    .describe('Mapping from file extension to LSP language ID'),
  transport: z.enum(['stdio', 'socket']).default('stdio').describe('Communication transport mechanism'),
  env: z.record(z.string(), z.string()).optional().describe('Environment variables to set when starting the server'),
  initializationOptions: z.unknown().optional().describe('Initialization options passed to the server'),
  settings: z.unknown().optional().describe('Settings passed to the server via didChangeConfiguration'),
  workspaceFolder: z.string().optional().describe('Workspace folder path to use for the server'),
  startupTimeout: z.number().int().positive().optional().describe('Maximum time to wait for server startup (ms)'),
  shutdownTimeout: z.number().int().positive().optional().describe('Maximum time to wait for graceful shutdown (ms)'),
  restartOnCrash: z.boolean().optional().describe('Whether to restart the server if it crashes'),
  maxRestarts: z.number().int().nonnegative().optional().describe('Maximum number of restart attempts'),
});

/** Original: N75 in chunks.90.mjs */
export const lspServersDefinitionSchema = z.object({
  lspServers: z.union([
    jsonFileSchema.describe('Path to .lsp.json configuration file'),
    z.record(z.string(), lspServerConfigSchema).describe('LSP server configurations keyed by server name'),
    z.array(z.union([jsonFileSchema, lspServerConfigSchema])).describe('Array of LSP server configurations'),
  ]),
});

/** Original: V4A in chunks.90.mjs */
export const unifiedPluginManifestSchema = z
  .object({
    ...baseMetadataSchema.shape,
    ...hooksConfigurationSchema.partial().shape,
    ...commandsDefinitionSchema.partial().shape,
    ...agentsDefinitionSchema.partial().shape,
    ...skillsDefinitionSchema.partial().shape,
    ...outputStylesDefinitionSchema.partial().shape,
    ...mcpServersDefinitionSchema.partial().shape,
    ...lspServersDefinitionSchema.partial().shape,
  })
  .strict();

/** Original: K4A in chunks.90.mjs */
const officialMarketplaceNames = new Set([
  'claude-code-marketplace',
  'claude-code-plugins',
  'claude-plugins-official',
  'anthropic-marketplace',
  'anthropic-plugins',
  'agent-skills',
  'life-sciences',
]);

/** Original: D75 in chunks.90.mjs */
const officialNamePattern = /(?:official[^a-z0-9]*(anthropic|claude)|(?:anthropic|claude)[^a-z0-9]*official|^(?:anthropic|claude)[^a-z0-9]*(marketplace|plugins|official))/i;

/** Original: W75 in chunks.90.mjs */
const nonAsciiPattern = /[^\u0020-\u007E]/;

/** Original: K75 in chunks.90.mjs */
function isImpersonatingOfficialName(name: string): boolean {
  if (officialMarketplaceNames.has(name.toLowerCase())) return false;
  if (nonAsciiPattern.test(name)) return true;
  return officialNamePattern.test(name);
}

/** Original: i62 in chunks.90.mjs */
const npmPackageNameSchema = z
  .string()
  .refine((val) => !val.includes('..') && !val.includes('//'), 'Package name cannot contain path traversal patterns')
  .refine((val) => {
    const scopedPattern = /^@[a-z0-9][a-z0-9-._]*\/[a-z0-9][a-z0-9-._]*$/;
    const standardPattern = /^[a-z0-9][a-z0-9-._]*$/;
    return scopedPattern.test(val) || standardPattern.test(val);
  }, 'Invalid npm package name format');

// ============================================
// Marketplace Schemas
// ============================================

/** Original: rxA in chunks.90.mjs */
export const marketplaceSourceSchema = z.discriminatedUnion('source', [
  z.object({
    source: z.literal('url'),
    url: z.string().url().describe('Direct URL to marketplace.json file'),
    headers: z.record(z.string(), z.string()).optional().describe('Custom HTTP headers'),
  }),
  z.object({
    source: z.literal('github'),
    repo: z.string().describe('GitHub repository in owner/repo format'),
    ref: z.string().optional().describe('Git branch or tag to use'),
    path: z.string().optional().describe('Path to marketplace.json within repo'),
  }),
  z.object({
    source: z.literal('git'),
    url: z.string().endsWith('.git').describe('Full git repository URL'),
    ref: z.string().optional().describe('Git branch or tag to use'),
    path: z.string().optional().describe('Path to marketplace.json within repo'),
  }),
  z.object({
    source: z.literal('npm'),
    package: npmPackageNameSchema.describe('NPM package containing marketplace.json'),
  }),
  z.object({
    source: z.literal('file'),
    path: z.string().describe('Local file path to marketplace.json'),
  }),
  z.object({
    source: z.literal('directory'),
    path: z.string().describe('Local directory containing .claude-plugin/marketplace.json'),
  }),
]);

/** Original: w75 in chunks.90.mjs */
export const pluginSourceSchema = z.union([
  relativeSourceSchema.describe('Path to the plugin root, relative to the marketplace directory'),
  z.object({
    source: z.literal('npm'),
    package: z.union([npmPackageNameSchema, z.string()]).describe('Package name'),
    version: z.string().optional().describe('Specific version or version range'),
    registry: z.string().url().optional().describe('Custom NPM registry URL'),
  }),
  z.object({
    source: z.literal('pip'),
    package: z.string().describe('Python package name'),
    version: z.string().optional().describe('Version specifier'),
    registry: z.string().url().optional().describe('Custom PyPI registry URL'),
  }),
  z.object({
    source: z.literal('url'),
    url: z.string().endsWith('.git').describe('Full git repository URL'),
    ref: z.string().optional().describe('Git branch or tag to use'),
  }),
  z.object({
    source: z.literal('github'),
    repo: z.string().describe('GitHub repository in owner/repo format'),
    ref: z.string().optional().describe('Git branch or tag to use'),
  }),
]);

/** Original: L75 in chunks.90.mjs */
export const marketplacePluginEntrySchema = unifiedPluginManifestSchema
  .partial()
  .extend({
    name: z
      .string()
      .min(1, 'Plugin name cannot be empty')
      .refine((val) => !val.includes(' '), { message: 'Plugin name cannot contain spaces. Use kebab-case (e.g., "my-plugin")' }),
    source: pluginSourceSchema.describe('Where to fetch the plugin from'),
    category: z.string().optional().describe('Category for organizing plugins'),
    tags: z.array(z.string()).optional().describe('Tags for searchability'),
    strict: z.boolean().optional().default(true).describe('Require plugin manifest to be present in plugin folder'),
  })
  .strict();

/** Original: JVA in chunks.90.mjs */
export const marketplaceJsonSchema = z.object({
  name: z
    .string()
    .min(1, 'Marketplace must have a name')
    .refine((val) => !val.includes(' '), { message: 'Marketplace name cannot contain spaces. Use kebab-case (e.g., "my-marketplace")' })
    .refine((val) => !isImpersonatingOfficialName(val), {
      message: 'Marketplace name cannot impersonate official Anthropic/Claude marketplaces. Names containing "official", "anthropic", or "claude" in official-sounding combinations are reserved.',
    }),
  owner: authorSchema.describe('Marketplace maintainer or curator information'),
  plugins: z.array(marketplacePluginEntrySchema).describe('Collection of available plugins'),
  metadata: z
    .object({
      pluginRoot: z.string().optional().describe('Base path for relative plugin sources'),
      version: z.string().optional().describe('Marketplace version'),
      description: z.string().optional().describe('Marketplace description'),
    })
    .optional(),
});

// ============================================
// Registry Schemas
// ============================================

/** Original: W4A in chunks.91.mjs */
export const pluginIdSchema = z.string().regex(/^[a-z0-9][-a-z0-9._]*@[a-z0-9][-a-z0-9._]*$/i, 'Plugin ID must be in format: plugin@marketplace');

/** Original: R75 in chunks.90.mjs */
export const installedPluginEntryV2Schema = z.object({
  scope: z.enum(['managed', 'user', 'project', 'local', 'flag']).describe('Installation scope'),
  projectPath: z.string().optional().describe('Project path (required for project/local scopes)'),
  installPath: z.string().describe('Absolute path to the versioned plugin directory'),
  version: z.string().optional().describe('Currently installed version'),
  installedAt: z.string().optional().describe('ISO 8601 timestamp of installation'),
  lastUpdated: z.string().optional().describe('ISO 8601 timestamp of last update'),
  gitCommitSha: z.string().optional().describe('Git commit SHA for git-based plugins'),
});

/** Original: txA in chunks.90.mjs */
export const installedPluginsV2Schema = z.object({
  version: z.literal(2).describe('Schema version 2'),
  plugins: z.record(pluginIdSchema, z.array(installedPluginEntryV2Schema)).describe('Map of plugin IDs to installation entries'),
});

/** Original: DI0 in chunks.90.mjs */
export const knownMarketplacesConfigSchema = z.record(
  z.string(),
  z.object({
    source: marketplaceSourceSchema.describe('Where to fetch the marketplace from'),
    installLocation: z.string().describe('Local cache path where marketplace manifest is stored'),
    lastUpdated: z.string().describe('ISO 8601 timestamp of last marketplace refresh'),
    autoUpdate: z.boolean().optional().describe('Whether to automatically update'),
  })
);
