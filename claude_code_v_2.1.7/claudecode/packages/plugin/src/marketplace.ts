/**
 * @claudecode/plugin - Marketplace Management
 *
 * Discovery, registration, and management of plugin marketplaces.
 * Reconstructed from chunks.90.mjs and chunks.91.mjs.
 */

import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync, renameSync, rmSync, realpathSync } from 'fs';
import { join, dirname, basename } from 'path';
import { spawnSync } from 'child_process';
import {
  marketplaceSourceSchema,
  marketplaceJsonSchema,
  knownMarketplacesConfigSchema,
} from './schemas.js';
import type {
  MarketplaceSource,
  MarketplaceManifest,
  KnownMarketplace,
  MarketplacePluginEntry,
} from './types.js';
import { loadSettings, saveSettings } from './settings.js';

// ============================================
// Internal State & Helpers
// ============================================

const log = (msg: string, options?: { level?: string }) => {
  if (process.env.DEBUG || process.env.CLAUDE_CODE_DEBUG) {
    console.error(`[Plugin:Marketplace] ${msg}`);
  }
};

/** Original: zQ in chunks.1.mjs */
function getClaudeDir(): string {
  const home = process.env.HOME || process.env.USERPROFILE || '';
  return join(home, '.claude');
}

/** Original: MZ1 in chunks.90.mjs */
export function getKnownMarketplacesPath(): string {
  return join(getClaudeDir(), 'plugins', 'known_marketplaces.json');
}

/** Original: Z32 in chunks.90.mjs */
export function getMarketplacesCacheDir(): string {
  return join(getClaudeDir(), 'plugins', 'marketplaces');
}

// ============================================
// Config Management
// ============================================

/** Original: D5 in chunks.90.mjs:2232-2256 */
export async function loadKnownMarketplaces(): Promise<Record<string, KnownMarketplace>> {
  const filePath = getKnownMarketplacesPath();
  if (!existsSync(filePath)) return {};

  try {
    const content = readFileSync(filePath, 'utf-8');
    const json = JSON.parse(content);
    const result = knownMarketplacesConfigSchema.safeParse(json);
    if (!result.success) {
      log(`Marketplace configuration file is corrupted: ${result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')}`, { level: 'error' });
      return {};
    }
    return result.data;
  } catch (err: any) {
    log(`Failed to load marketplace configuration: ${err.message}`, { level: 'error' });
    return {};
  }
}

/** Original: FVA in chunks.90.mjs:2258-2268 */
export async function saveKnownMarketplaces(marketplaces: Record<string, KnownMarketplace>): Promise<void> {
  const filePath = getKnownMarketplacesPath();
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const result = knownMarketplacesConfigSchema.safeParse(marketplaces);
  if (!result.success) throw new Error(`Invalid marketplace config: ${result.error.message}`);
  
  writeFileSync(filePath, JSON.stringify(result.data, null, 2), 'utf-8');
}

// ============================================
// Policy Checks
// ============================================

/** Original: WVA in chunks.90.mjs:2089-2093 */
function getAllowedMarketplaceSources(): MarketplaceSource[] | null {
  // Stub for dB("policySettings")
  return null;
}

/** Original: c75 in chunks.90.mjs:2095-2099 */
function getBlockedMarketplaceSources(): MarketplaceSource[] | null {
  // Stub for dB("policySettings")
  return null;
}

/** Original: p75 in chunks.90.mjs:2101-2118 */
function areMarketplaceSourcesEqualStrict(a: MarketplaceSource, b: MarketplaceSource): boolean {
  if (a.source !== b.source) return false;
  switch (a.source) {
    case 'url': return a.url === (b as any).url;
    case 'github': return a.repo === (b as any).repo && a.ref === (b as any).ref && a.path === (b as any).path;
    case 'git': return a.url === (b as any).url && a.ref === (b as any).ref && a.path === (b as any).path;
    case 'npm': return a.package === (b as any).package;
    case 'file': return a.path === (b as any).path;
    case 'directory': return a.path === (b as any).path;
    default: return false;
  }
}

/** Original: s62 in chunks.90.mjs:2121-2127 */
function extractGitHubRepoFromUrl(url: string): string | null {
  const sshMatch = url.match(/^git@github\.com:([^/]+\/[^/]+?)(?:\.git)?$/);
  if (sshMatch && sshMatch[1]) return sshMatch[1];
  const httpsMatch = url.match(/^https?:\/\/github\.com\/([^/]+\/[^/]+?)(?:\.git)?$/);
  if (httpsMatch && httpsMatch[1]) return httpsMatch[1];
  return null;
}

/** Original: Or in chunks.90.mjs:2129-2132 */
function areRefsEqual(a?: string, b?: string): boolean {
  return (a || undefined) === (b || undefined);
}

/** Original: l75 in chunks.90.mjs:2134-2164 */
function areMarketplaceSourcesEquivalent(a: MarketplaceSource, b: MarketplaceSource): boolean {
  if (a.source === b.source) {
    switch (a.source) {
      case 'github': return a.repo === (b as any).repo && areRefsEqual(a.ref, (b as any).ref) && areRefsEqual(a.path, (b as any).path);
      case 'git': return a.url === (b as any).url && areRefsEqual(a.ref, (b as any).ref) && areRefsEqual(a.path, (b as any).path);
      case 'url': return a.url === (b as any).url;
      case 'npm': return a.package === (b as any).package;
      case 'file': return a.path === (b as any).path;
      case 'directory': return a.path === (b as any).path;
      default: return false;
    }
  }
  if (a.source === 'git' && b.source === 'github') {
    if (extractGitHubRepoFromUrl(a.url) === b.repo) return areRefsEqual(a.ref, b.ref) && areRefsEqual(a.path, b.path);
  }
  if (a.source === 'github' && b.source === 'git') {
    if (extractGitHubRepoFromUrl(b.url) === a.repo) return areRefsEqual(a.ref, b.ref) && areRefsEqual(a.path, b.path);
  }
  return false;
}

/** Original: AyA in chunks.90.mjs:2166-2170 */
export function isMarketplaceSourceBlocked(source: MarketplaceSource): boolean {
  const blocked = getBlockedMarketplaceSources();
  if (blocked === null) return false;
  return blocked.some(b => areMarketplaceSourcesEquivalent(source, b));
}

/** Original: H4A in chunks.90.mjs:2172-2177 */
export function isMarketplaceSourceAllowed(source: MarketplaceSource): boolean {
  if (isMarketplaceSourceBlocked(source)) return false;
  const allowed = getAllowedMarketplaceSources();
  if (allowed === null) return true;
  return allowed.some(a => areMarketplaceSourcesEqualStrict(source, a));
}

/** Original: KVA in chunks.90.mjs:2179-2196 */
export function formatMarketplaceSourceForDisplay(source: MarketplaceSource): string {
  switch (source.source) {
    case 'github': return `github:${source.repo}${source.ref ? `@${source.ref}` : ''}`;
    case 'url': return source.url;
    case 'git': return `git:${source.url}${source.ref ? `@${source.ref}` : ''}`;
    case 'npm': return `npm:${source.package}`;
    case 'file': return `file:${source.path}`;
    case 'directory': return `dir:${source.path}`;
    default: return 'unknown source';
  }
}

// ============================================
// Source Utilities
// ============================================

/** Original: t75 in chunks.91.mjs:3-5 */
function generateTempName(source: MarketplaceSource): string {
  switch (source.source) {
    case 'github': return source.repo.replace(/\//g, '-');
    case 'npm': return source.package.replace(/@/g, '').replace(/\//g, '-');
    case 'file': return basename(source.path).replace('.json', '');
    case 'directory': return basename(source.path);
    default: return `temp_${Date.now()}`;
  }
}

/** Original: QyA in chunks.90.mjs:2270-2283 */
function getGitEnv() {
  const env: Record<string, string> = { ...process.env as any };
  if (process.env.GITHUB_TOKEN) env.GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (process.env.GH_TOKEN) env.GH_TOKEN = process.env.GH_TOKEN;
  // ... rest of tokens
  env.GIT_TERMINAL_PROMPT = '0';
  env.GIT_ASKPASS = '';
  return env;
}

/** Original: n75 in chunks.90.mjs:2285-2298 */
function injectAuthIntoUrl(url: string): string {
  if (!url.startsWith('https://')) return url;
  try {
    const u = new URL(url);
    if (u.username || u.password) return url;
    if (u.hostname.toLowerCase() === 'github.com') {
      const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
      if (token) {
        u.username = 'x-access-token';
        u.password = token;
        return u.toString();
      }
    }
    return url;
  } catch {
    return url;
  }
}

/** Original: o75 in chunks.90.mjs:264414 */
async function isSshConfigured(): Promise<boolean> {
  try {
    const res = spawnSync('ssh', ['-T', 'git@github.com'], { env: getGitEnv() });
    return res.status === 1;
  } catch {
    return false;
  }
}

/** Original: VVA in chunks.90.mjs:264424 */
async function gitCloneWithSubmodules(url: string, dest: string, ref?: string, progress?: (msg: string) => void): Promise<void> {
  const authenticatedUrl = injectAuthIntoUrl(url);
  progress?.(`Cloning ${url} to ${dest}...`);
  const args = ['clone', '--depth', '1', '--recurse-submodules', '--shallow-submodules'];
  if (ref) args.push('--branch', ref);
  args.push(authenticatedUrl, dest);
  
  const res = spawnSync('git', args, { env: getGitEnv() });
  if (res.status !== 0) {
    throw new Error(`Failed to clone repository: ${res.stderr.toString()}`);
  }
}

// ============================================
// Marketplace Loading
// ============================================

/** Original: VI0 in chunks.91.mjs:17-134 */
export async function loadMarketplaceSource(
  source: MarketplaceSource,
  progress?: (msg: string) => void
): Promise<{ marketplace: MarketplaceManifest; cachePath: string }> {
  const cacheDir = getMarketplacesCacheDir();
  if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });

  let tempPath: string;
  let manifestPath: string;
  let isTemp = false;
  const tempName = generateTempName(source);

  try {
    switch (source.source) {
      case 'url': {
        tempPath = join(cacheDir, `${tempName}.json`);
        isTemp = true;
        // Logic for download from URL...
        throw new Error("URL marketplace sources not fully implemented");
      }
      case 'github': {
        const sshUrl = `git@github.com:${source.repo}.git`;
        const httpsUrl = `https://github.com/${source.repo}.git`;
        tempPath = join(cacheDir, tempName);
        isTemp = true;
        
        let error: Error | null = null;
        if (await isSshConfigured()) {
          try {
            await gitCloneWithSubmodules(sshUrl, tempPath, source.ref, progress);
          } catch (err: any) {
            error = err;
            if (existsSync(tempPath)) rmSync(tempPath, { recursive: true, force: true });
            await gitCloneWithSubmodules(httpsUrl, tempPath, source.ref, progress);
            error = null;
          }
        } else {
          try {
            await gitCloneWithSubmodules(httpsUrl, tempPath, source.ref, progress);
          } catch (err: any) {
            error = err;
            if (existsSync(tempPath)) rmSync(tempPath, { recursive: true, force: true });
            await gitCloneWithSubmodules(sshUrl, tempPath, source.ref, progress);
            error = null;
          }
        }
        if (error) throw error;
        manifestPath = join(tempPath, source.path || '.claude-plugin/marketplace.json');
        break;
      }
      case 'git': {
        tempPath = join(cacheDir, tempName);
        isTemp = true;
        await gitCloneWithSubmodules(source.url, tempPath, source.ref, progress);
        manifestPath = join(tempPath, source.path || '.claude-plugin/marketplace.json');
        break;
      }
      case 'file': {
        manifestPath = source.path;
        tempPath = dirname(dirname(source.path)); 
        isTemp = false;
        break;
      }
      case 'directory': {
        manifestPath = join(source.path, '.claude-plugin', 'marketplace.json');
        tempPath = source.path;
        isTemp = false;
        break;
      }
      default:
        throw new Error('Unsupported marketplace source type');
    }

    if (!existsSync(manifestPath)) throw new Error(`Marketplace file not found at ${manifestPath}`);
    
    const manifest = marketplaceJsonSchema.parse(JSON.parse(readFileSync(manifestPath, 'utf-8')));
    const finalCachePath = join(cacheDir, manifest.name);

    if (tempPath !== finalCachePath && !['file', 'directory'].includes(source.source)) {
      if (existsSync(finalCachePath)) {
        progress?.('Cleaning up old marketplace cache…');
        rmSync(finalCachePath, { recursive: true, force: true });
      }
      renameSync(tempPath, finalCachePath);
      tempPath = finalCachePath;
      isTemp = false;
    }

    return { marketplace: manifest, cachePath: tempPath };
  } catch (err: any) {
    if (isTemp && tempPath! && existsSync(tempPath)) {
      rmSync(tempPath, { recursive: true, force: true });
    }
    throw err;
  }
}

/** Original: rC in chunks.91.mjs:355-370 */
// Implementation should be memoized using createMemoizedAsync-like structure if needed
export async function loadMarketplaceManifest(name: string): Promise<MarketplaceManifest> {
  const known = (await loadKnownMarketplaces())[name];
  if (!known) throw new Error(`Marketplace '${name}' not found`);

  try {
    const loc = known.installLocation;
    const manifestPath = statSync(loc).isDirectory() ? join(loc, '.claude-plugin', 'marketplace.json') : loc;
    if (existsSync(manifestPath)) {
      return marketplaceJsonSchema.parse(JSON.parse(readFileSync(manifestPath, 'utf-8')));
    }
  } catch (err) {}

  const { marketplace, cachePath } = await loadMarketplaceSource(known.source);
  const all = await loadKnownMarketplaces();
  if (all[name]) {
    all[name].lastUpdated = new Date().toISOString();
    all[name].installLocation = cachePath;
    await saveKnownMarketplaces(all);
  }
  return marketplace;
}

// ============================================
// CRUD Operations
// ============================================

/** Original: NS in chunks.91.mjs:136-156 */
export async function addMarketplaceSource(
  source: MarketplaceSource,
  progress?: (msg: string) => void
): Promise<{ name: string }> {
  if (!isMarketplaceSourceAllowed(source)) {
    if (isMarketplaceSourceBlocked(source)) throw new Error(`Marketplace source '${formatMarketplaceSourceForDisplay(source)}' is blocked by enterprise policy.`);
    throw new Error(`Marketplace source '${formatMarketplaceSourceForDisplay(source)}' is not in the allowed marketplace list.`);
  }

  const { marketplace, cachePath } = await loadMarketplaceSource(source, progress);
  // Official name impersonation check (c62 in source)
  // ...

  const marketplaces = await loadKnownMarketplaces();
  if (marketplaces[marketplace.name]) throw new Error(`Marketplace '${marketplace.name}' already exists.`);

  marketplaces[marketplace.name] = {
    source,
    installLocation: cachePath,
    lastUpdated: new Date().toISOString(),
  };

  await saveKnownMarketplaces(marketplaces);
  return { name: marketplace.name };
}

/** Original: _Z1 in chunks.91.mjs:158-201 */
export async function removeMarketplace(name: string): Promise<void> {
  const marketplaces = await loadKnownMarketplaces();
  if (!marketplaces[name]) throw new Error(`Marketplace '${name}' not found`);

  const loc = marketplaces[name].installLocation;
  delete marketplaces[name];
  await saveKnownMarketplaces(marketplaces);

  if (loc.startsWith(getMarketplacesCacheDir()) && existsSync(loc)) {
    rmSync(loc, { recursive: true, force: true });
  }

  // Cleanup settings enabledPlugins
  const settings = await loadSettings();
  if (settings.enabledPlugins) {
    const suffix = `@${name}`;
    let changed = false;
    for (const id of Object.keys(settings.enabledPlugins)) {
      if (id.endsWith(suffix)) {
        delete settings.enabledPlugins[id];
        changed = true;
      }
    }
    if (changed) await saveSettings(settings);
  }
}

/** Original: HI0 in chunks.91.mjs:237-262 */
export function findPluginInCachedMarketplace(sourceId: string): { entry: MarketplacePluginEntry; marketplaceInstallLocation: string } | null {
  const [pluginName, marketName] = sourceId.split('@');
  if (!pluginName || !marketName) return null;

  try {
    const configPath = getKnownMarketplacesPath();
    if (!existsSync(configPath)) return null;

    const marketplaces = JSON.parse(readFileSync(configPath, 'utf-8'));
    const marketConfig = marketplaces[marketName];
    if (!marketConfig) return null;

    const loc = marketConfig.installLocation;
    const manifestPath = statSync(loc).isDirectory() ? join(loc, '.claude-plugin', 'marketplace.json') : loc;
    
    if (!existsSync(manifestPath)) return null;
    const manifest: MarketplaceManifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    
    const entry = manifest.plugins.find(p => p.name === pluginName);
    if (!entry) return null;

    return { entry, marketplaceInstallLocation: loc };
  } catch {
    return null;
  }
}
