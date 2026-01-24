/**
 * @claudecode/plugin - Plugin Installation
 *
 * Install, uninstall, enable, and disable plugins.
 * Reconstructed from chunks.90.mjs, chunks.91.mjs, and chunks.130.mjs.
 */

import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync, readdirSync, rmSync, copyFileSync, renameSync, readlinkSync, symlinkSync, realpathSync } from 'fs';
import { join, dirname, basename, resolve } from 'path';
import { spawnSync } from 'child_process';
import type {
  PluginSource,
  PluginManifest,
  InstalledPluginEntry,
  InstalledPluginsRegistry,
  InstallScope,
} from './types.js';
import {
  installedPluginsV2Schema,
  unifiedPluginManifestSchema,
} from './schemas.js';
import {
  loadMarketplaceManifest,
} from './marketplace.js';

// ============================================
// Internal State & Helpers
// ============================================

const log = (msg: string, options?: { level?: string }) => {
  if (process.env.DEBUG || process.env.CLAUDE_CODE_DEBUG) {
    console.error(`[Plugin:Installation] ${msg}`);
  }
};

/** Original: zQ in chunks.1.mjs */
function getClaudeDir(): string {
  const home = process.env.HOME || process.env.USERPROFILE || '';
  return join(home, '.claude');
}

/** Original: ByA in chunks.91.mjs:444 */
export function getInstalledPluginsPath(): string {
  return join(getClaudeDir(), 'plugins', 'installed_plugins.json');
}

/** Original: BG5 in chunks.91.mjs:448 */
export function getInstalledPluginsV2Path(): string {
  return join(getClaudeDir(), 'plugins', 'installed_plugins_v2.json');
}

/** Original: Tr in chunks.130.mjs:2319 */
export function getPluginCacheDir(): string {
  return join(getClaudeDir(), 'plugins', 'cache');
}

/** Original: xb in chunks.130.mjs:2324-2331 */
export function getVersionedCachePath(sourceId: string, version: string): string {
  const [pluginName, marketName] = sourceId.split('@');
  return join(getPluginCacheDir(), marketName!, pluginName!, version);
}

/**
 * Recursive file copy helper.
 * Original: rfA in chunks.130.mjs:2333-2365
 */
export function recursiveCopySync(src: string, dest: string): void {
  if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    
    if (entry.isDirectory()) {
      recursiveCopySync(srcPath, destPath);
    } else if (entry.isFile()) {
      copyFileSync(srcPath, destPath);
    } else if (entry.isSymbolicLink()) {
      const target = readlinkSync(srcPath);
      try {
        realpathSync(srcPath);
        symlinkSync(target, destPath);
      } catch {
        // Handle broken symlinks or complex path issues matching source catch block
        symlinkSync(target, destPath);
      }
    }
  }
}

// ============================================
// Git Helpers
// ============================================

/** Original: J2 / TQ in source */
function runGit(args: string[], options: any = {}) {
  try {
    const result = spawnSync('git', args, {
      encoding: 'utf-8',
      ...options,
      env: { ...process.env, ...options.env, GIT_TERMINAL_PROMPT: '0' },
    });
    return {
      code: result.status,
      stdout: result.stdout,
      stderr: result.stderr,
    };
  } catch (err: any) {
    return { code: -1, stderr: err.message };
  }
}

/** Original: AG5 in chunks.91.mjs:386 */
async function getGitHeadSha(cwd: string): Promise<string | null> {
  const res = runGit(['rev-parse', 'HEAD'], { cwd });
  if (res.code === 0 && res.stdout) return res.stdout.trim();
  return null;
}

/** Original: qB7 in chunks.130.mjs:2415-2421 */
async function gitCloneWithSubmodules(url: string, dest: string, ref?: string) {
  const args = ['clone', '--depth', '1', '--recurse-submodules', '--shallow-submodules'];
  if (ref) args.push('--branch', ref);
  args.push(url, dest);
  
  const res = runGit(args, { timeout: 60000 });
  if (res.code !== 0) {
    throw new Error(`Failed to clone repository: ${res.stderr}`);
  }
}

// ============================================
// Registry Management
// ============================================

let cachedRegistry: InstalledPluginsRegistry | null = null;

/** Original: f_ in chunks.91.mjs:551-578 */
export async function loadInstalledPlugins(): Promise<InstalledPluginsRegistry> {
  if (cachedRegistry) return cachedRegistry;
  
  const filePath = getInstalledPluginsPath();
  if (!existsSync(filePath)) {
    return { version: 2, plugins: {} };
  }

  try {
    const content = readFileSync(filePath, 'utf-8');
    const json = JSON.parse(content);
    
    if (json.version === 2) {
      cachedRegistry = installedPluginsV2Schema.parse(json);
    } else {
      log('Loading legacy V1 plugin registry');
      const v1Plugins = json.plugins || {};
      const v2Plugins: Record<string, InstalledPluginEntry[]> = {};
      for (const [id, entry] of Object.entries(v1Plugins as any)) {
        v2Plugins[id] = [{
          scope: 'user',
          installPath: (entry as any).installPath,
          version: (entry as any).version,
          installedAt: (entry as any).installedAt,
          lastUpdated: (entry as any).lastUpdated,
          gitCommitSha: (entry as any).gitCommitSha,
        }];
      }
      cachedRegistry = { version: 2, plugins: v2Plugins };
    }
    return cachedRegistry!;
  } catch (err: any) {
    log(`Failed to load installed plugins: ${err.message}`, { level: 'error' });
    return { version: 2, plugins: {} };
  }
}

/** Original: UI0 in chunks.91.mjs:580-595 */
export async function saveInstalledPlugins(registry: InstalledPluginsRegistry): Promise<void> {
  const filePath = getInstalledPluginsPath();
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const validated = installedPluginsV2Schema.parse(registry);
  writeFileSync(filePath, JSON.stringify(validated, null, 2), 'utf-8');
  cachedRegistry = validated;
}

// ============================================
// Versioning & Caching
// ============================================

/** Original: Od in chunks.91.mjs:373-384 */
export async function resolvePluginVersion(
  sourceId: string,
  source: PluginSource,
  manifest?: PluginManifest,
  dir?: string,
  providedVersion?: string
): Promise<string> {
  if (manifest?.version) {
    log(`Using manifest version for ${sourceId}: ${manifest.version}`);
    return manifest.version;
  }
  if (providedVersion) {
    log(`Using provided version for ${sourceId}: ${providedVersion}`);
    return providedVersion;
  }
  if (dir) {
    const sha = await getGitHeadSha(dir);
    if (sha) {
      const shortSha = sha.substring(0, 12);
      log(`Using git SHA for ${sourceId}: ${shortSha}`);
      return shortSha;
    }
  }
  log(`No version found for ${sourceId}, using 'unknown'`);
  return 'unknown';
}

/** Original: wF1 in chunks.130.mjs:2368-2400 */
export async function copyToVersionedCache(
  srcPath: string,
  sourceId: string,
  version: string,
  entry?: any,
  marketDir?: string
): Promise<string> {
  const destPath = getVersionedCachePath(sourceId, version);
  
  const isDirEmpty = (p: string) => {
    try {
      return readdirSync(p).length === 0;
    } catch {
      return true;
    }
  };

  if (existsSync(destPath) && !isDirEmpty(destPath)) {
    log(`Plugin ${sourceId} version ${version} already cached at ${destPath}`);
    return destPath;
  }
  
  if (existsSync(destPath) && isDirEmpty(destPath)) {
    log(`Removing empty cache directory for ${sourceId} at ${destPath}`);
    rmSync(destPath, { recursive: true, force: true });
  }

  mkdirSync(destPath, { recursive: true });
  
  if (entry && typeof entry.source === 'string' && marketDir) {
    const fullSrc = join(marketDir, entry.source);
    if (existsSync(fullSrc)) {
      log(`Copying source directory ${entry.source} for plugin ${sourceId}`);
      recursiveCopySync(fullSrc, destPath);
    } else {
      throw new Error(`Plugin source directory not found: ${fullSrc} (from entry.source: ${entry.source})`);
    }
  } else {
    log(`Copying plugin ${sourceId} to versioned cache (fallback to full copy)`);
    recursiveCopySync(srcPath, destPath);
  }
  
  const gitDir = join(destPath, '.git');
  if (existsSync(gitDir)) {
    rmSync(gitDir, { recursive: true, force: true });
  }

  if (isDirEmpty(destPath)) {
    throw new Error(`Failed to copy plugin ${sourceId} to versioned cache: destination is empty after copy`);
  }
  
  log(`Successfully cached plugin ${sourceId} at ${destPath}`);
  return destPath;
}

// ============================================
// Download Logic
// ============================================

/** Original: LB7 in chunks.130.mjs:2447 */
function generateDownloadTempName(source: PluginSource): string {
  const ts = Date.now();
  const rnd = Math.random().toString(36).substring(2, 8);
  let type = 'unknown';
  if (typeof source === 'string') type = 'local';
  else {
    switch(source.source) {
      case 'npm': type = 'npm'; break;
      case 'pip': type = 'pip'; break;
      case 'github': type = 'github'; break;
      case 'url': type = 'git'; break;
      default: type = 'unknown';
    }
  }
  return `temp_plugin_${type}_${ts}_${rnd}`;
}

/** Original: $3A in chunks.130.mjs:2471-2566 */
export async function downloadPluginFromSource(
  source: PluginSource,
  options?: { manifest?: Partial<PluginManifest> }
): Promise<{ path: string; manifest: PluginManifest }> {
  const cacheDir = getPluginCacheDir();
  if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });

  const tempName = generateDownloadTempName(source);
  const tempPath = join(cacheDir, tempName);
  let isPathCreated = false;

  try {
    log(`Caching plugin from source to temporary path ${tempPath}`);
    isPathCreated = true;

    if (typeof source === 'string') {
      if (!existsSync(source)) throw new Error(`Source path does not exist: ${source}`);
      mkdirSync(tempPath, { recursive: true });
      recursiveCopySync(source, tempPath);
      const gitDir = join(tempPath, '.git');
      if (existsSync(gitDir)) rmSync(gitDir, { recursive: true, force: true });
    } else {
      switch (source.source) {
        case 'github':
          const ghUrl = `git@github.com:${source.repo}.git`;
          await gitCloneWithSubmodules(ghUrl, tempPath, source.ref);
          break;
        case 'url':
          await gitCloneWithSubmodules(source.url, tempPath, source.ref);
          break;
        case 'npm':
          throw new Error('NPM plugin sources not yet supported');
        case 'pip':
          throw new Error('Python/Pip plugin sources not yet supported');
        default:
          throw new Error('Unsupported plugin source type');
      }
    }
  } catch (err) {
    if (isPathCreated && existsSync(tempPath)) rmSync(tempPath, { recursive: true, force: true });
    throw err;
  }

  // Load manifest to find official name
  const manifestLocations = [
    join(tempPath, '.claude-plugin', 'plugin.json'),
    join(tempPath, 'plugin.json')
  ];
  
  let manifest: PluginManifest | null = null;
  for (const loc of manifestLocations) {
    if (existsSync(loc)) {
      try {
        const content = readFileSync(loc, 'utf-8');
        manifest = unifiedPluginManifestSchema.parse(JSON.parse(content));
        break;
      } catch (err) {
        log(`Failed to parse manifest at ${loc}: ${err}`, { level: 'warn' });
      }
    }
  }

  if (!manifest) {
    manifest = {
      name: options?.manifest?.name || tempName,
      description: options?.manifest?.description || 'Cached plugin',
    } as PluginManifest;
  }

  const finalName = manifest.name.replace(/[^a-zA-Z0-9-_]/g, '-');
  const finalPath = join(cacheDir, finalName);
  
  if (existsSync(finalPath)) rmSync(finalPath, { recursive: true, force: true });
  renameSync(tempPath, finalPath);
  
  return { path: finalPath, manifest };
}

// ============================================
// Installation Operations
// ============================================

/** Original: ofA in chunks.130.mjs:2267-2303 */
export async function installPlugin(
  pluginId: string,
  options: {
    scope?: InstallScope;
    projectPath?: string;
    progressCallback?: (message: string) => void;
  } = {}
): Promise<{ pluginId: string; installPath: string }> {
  const [name, marketName] = pluginId.split('@');
  if (!name || !marketName) throw new Error(`Invalid plugin ID format: ${pluginId}`);
  
  const scope = options.scope || 'user';
  
  const manifest = await loadMarketplaceManifest(marketName);
  const entry = manifest.plugins.find(p => p.name === name);
  if (!entry) throw new Error(`Plugin '${name}' not found in marketplace '${marketName}'`);

  if (options.progressCallback) options.progressCallback(`Downloading ${name} from ${marketName}...`);
  const { path: downloadPath, manifest: pluginManifest } = await downloadPluginFromSource(entry.source, { manifest: entry });
  
  const version = await resolvePluginVersion(pluginId, entry.source, pluginManifest, downloadPath, entry.version);
  const installPath = await copyToVersionedCache(downloadPath, pluginId, version, entry, undefined);

  if (downloadPath !== installPath) rmSync(downloadPath, { recursive: true, force: true });

  const registry = await loadInstalledPlugins();
  const entries = registry.plugins[pluginId] || [];
  const newEntry: InstalledPluginEntry = {
    scope,
    projectPath: options.projectPath,
    installPath,
    version,
    installedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    gitCommitSha: await getGitHeadSha(installPath) || undefined,
  };

  const idx = entries.findIndex(e => e.scope === scope && e.projectPath === options.projectPath);
  if (idx >= 0) entries[idx] = newEntry;
  else entries.push(newEntry);

  registry.plugins[pluginId] = entries;
  await saveInstalledPlugins(registry);

  return { pluginId, installPath };
}
