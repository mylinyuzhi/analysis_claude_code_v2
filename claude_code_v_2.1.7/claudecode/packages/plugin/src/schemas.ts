/**
 * @claudecode/plugin - Plugin Schemas
 *
 * Zod schemas for plugin system validation.
 * Reconstructed from chunks.91.mjs, chunks.130.mjs
 */

import { z } from 'zod';

// ============================================
// Plugin ID
// ============================================

/**
 * Plugin ID format: "plugin-name@marketplace-name"
 * Original: W4A in chunks.91.mjs
 */
export const pluginIdSchema = z
  .string()
  .regex(
    /^[a-z0-9-]+@[a-z0-9-]+$/,
    'Plugin ID must be in format: plugin-name@marketplace-name'
  );

// ============================================
// Hook Schemas
// ============================================

/**
 * Hook entry schema.
 */
export const hookEntrySchema = z.object({
  type: z.enum(['command', 'url']),
  command: z.string().optional(),
  url: z.string().url().optional(),
  timeout: z.number().optional(),
  retries: z.number().optional(),
});

/**
 * Hooks file schema.
 * Original: l62 in chunks.130.mjs
 */
export const hooksFileSchema = z.object({
  hooks: z.object({
    PreToolUse: z.array(hookEntrySchema).optional(),
    PostToolUse: z.array(hookEntrySchema).optional(),
    PreMessage: z.array(hookEntrySchema).optional(),
    PostMessage: z.array(hookEntrySchema).optional(),
    Stop: z.array(hookEntrySchema).optional(),
  }),
});

// ============================================
// Command Schemas
// ============================================

/**
 * Command definition schema.
 */
export const commandDefinitionSchema = z.object({
  source: z.string().optional(),
  content: z.string().optional(),
  description: z.string().optional(),
});

// ============================================
// Plugin Source Schemas
// ============================================

/**
 * GitHub plugin source.
 */
export const githubSourceSchema = z.object({
  source: z.literal('github'),
  repo: z.string().regex(/^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/),
  ref: z.string().optional(),
});

/**
 * GitHub default branch source.
 */
export const githubDefaultBranchSourceSchema = z.object({
  source: z.literal('github-default-branch'),
  repo: z.string().regex(/^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/),
  path: z.string().optional(),
});

/**
 * Git plugin source.
 */
export const gitSourceSchema = z.object({
  source: z.literal('git'),
  url: z.string(),
  ref: z.string().optional(),
});

/**
 * URL plugin source.
 */
export const urlSourceSchema = z.object({
  source: z.literal('url'),
  url: z.string().url(),
  headers: z.record(z.string()).optional(),
});

/**
 * File plugin source.
 */
export const fileSourceSchema = z.object({
  source: z.literal('file'),
  path: z.string(),
});

/**
 * Directory plugin source.
 */
export const directorySourceSchema = z.object({
  source: z.literal('directory'),
  path: z.string(),
});

/**
 * NPM plugin source.
 */
export const npmSourceSchema = z.object({
  source: z.literal('npm'),
  package: z.string(),
});

/**
 * Plugin source union.
 */
export const pluginSourceSchema = z.discriminatedUnion('source', [
  githubSourceSchema,
  gitSourceSchema,
  urlSourceSchema,
  fileSourceSchema,
  directorySourceSchema,
  npmSourceSchema,
]);

/**
 * Marketplace source schema (includes github-default-branch).
 */
export const marketplaceSourceSchema = z.discriminatedUnion('source', [
  githubDefaultBranchSourceSchema,
  githubSourceSchema,
  gitSourceSchema,
  urlSourceSchema,
  fileSourceSchema,
  directorySourceSchema,
  npmSourceSchema,
]);

// ============================================
// LSP Server Schema
// ============================================

/**
 * LSP server configuration schema.
 * Original: YVA in chunks.90.mjs
 */
export const lspServerConfigSchema = z.object({
  command: z.string(),
  args: z.array(z.string()).optional(),
  env: z.record(z.string()).optional(),
  extensionToLanguage: z.record(z.string()).optional(),
  transport: z.enum(['stdio', 'socket']).optional(),
  initializationOptions: z.unknown().optional(),
  settings: z.unknown().optional(),
  workspaceFolder: z.string().optional(),
  startupTimeout: z.number().optional(),
  shutdownTimeout: z.number().optional(),
  restartOnCrash: z.boolean().optional(),
  maxRestarts: z.number().optional(),
});

// ============================================
// Plugin Manifest Schema
// ============================================

/**
 * Plugin manifest schema (plugin.json).
 */
export const pluginManifestSchema = z.object({
  name: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Plugin name must be lowercase, alphanumeric with hyphens'),
  version: z.string().optional(),
  description: z.string().optional(),
  commands: z
    .union([
      z.string(),
      z.array(z.string()),
      z.record(commandDefinitionSchema),
    ])
    .optional(),
  agents: z.union([z.string(), z.array(z.string())]).optional(),
  skills: z.union([z.string(), z.array(z.string())]).optional(),
  hooks: z
    .union([z.string(), z.array(z.string()), hooksFileSchema.shape.hooks])
    .optional(),
  outputStyles: z.union([z.string(), z.array(z.string())]).optional(),
  lspServers: z.record(lspServerConfigSchema).optional(),
});

// ============================================
// Marketplace Schema
// ============================================

/**
 * Marketplace plugin entry schema.
 */
export const marketplacePluginEntrySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  version: z.string().optional(),
  author: z.string().optional(),
  source: z.union([z.string(), pluginSourceSchema]),
  tags: z.array(z.string()).optional(),
  license: z.string().optional(),
});

/**
 * Marketplace manifest schema (marketplace.json).
 * Original: JVA in chunks.91.mjs
 */
export const marketplaceJsonSchema = z.object({
  name: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Marketplace name must be lowercase'),
  description: z.string().optional(),
  author: z.string().optional(),
  url: z.string().url().optional(),
  plugins: z.array(marketplacePluginEntrySchema),
});

// ============================================
// Installed Plugins Schema
// ============================================

/**
 * Installation scope.
 */
export const installScopeSchema = z.enum(['managed', 'user', 'project', 'local']);

/**
 * Installed plugin entry schema (v2).
 */
export const installedPluginEntrySchema = z.object({
  scope: installScopeSchema,
  version: z.string(),
  installPath: z.string(),
  installedAt: z.string().datetime(),
  lastUpdated: z.string().datetime().optional(),
  gitCommitSha: z.string().optional(),
  projectPath: z.string().optional(),
});

/**
 * Installed plugins registry schema (v1 - legacy).
 */
export const installedPluginsV1Schema = z.object({
  version: z.literal(1),
  plugins: z.record(
    z.object({
      version: z.string(),
      installedAt: z.string().datetime(),
      lastUpdated: z.string().datetime().optional(),
      installPath: z.string(),
      gitCommitSha: z.string().optional(),
    })
  ),
});

/**
 * Installed plugins registry schema (v2 - current).
 */
export const installedPluginsV2Schema = z.object({
  version: z.literal(2),
  plugins: z.record(z.array(installedPluginEntrySchema)),
});

/**
 * Known marketplaces config schema.
 */
export const knownMarketplacesSchema = z.record(
  z.object({
    source: marketplaceSourceSchema,
    installLocation: z.string(),
    lastUpdated: z.string().datetime(),
    autoUpdate: z.boolean().optional(),
  })
);

// ============================================
// Export
// ============================================

// NOTE: 以上 schema 在本文件内已使用 `export const ...` 导出。
// 保留重复的 `export { ... }` 会导致 TypeScript / esbuild 报“重复导出”。
