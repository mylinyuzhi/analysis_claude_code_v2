/**
 * @claudecode/features - Skill Loader
 *
 * Full skill loading pipeline with multi-source support.
 * Reconstructed from chunks.130.mjs, chunks.133.mjs, chunks.146.mjs
 *
 * Key symbols:
 * - Wz7 → getSkills (main orchestrator)
 * - lO0 → loadSkillDirectoryCommands
 * - tw0 → getPluginSkills
 * - kZ9 → getBundledSkills
 * - cO0 → scanSkillDirectory
 * - So2 → loadSkillsFromPath
 *
 * Loading pipeline:
 * 1. Directory skills (managed, user, project)
 * 2. Plugin skills (from enabled plugins)
 * 3. Bundled skills (built-in)
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join, dirname, basename } from 'path';
import { homedir } from 'os';
import type {
  SkillDefinition,
  RegisteredSkill,
  SkillDiscoveryResult,
} from './types.js';
import { SKILL_CONSTANTS } from './types.js';
import { parseSkillFile } from './parser.js';

// ============================================
// Types
// ============================================

/**
 * Skill source type.
 */
export type SkillSource =
  | 'managed'        // Policy/managed directory
  | 'user'           // User home directory
  | 'project'        // Project directory
  | 'plugin'         // From plugin
  | 'bundled';       // Built-in

/**
 * Loaded skill with metadata.
 */
export interface LoadedSkillEntry {
  skill: SkillDefinition & { source: SkillSource };
  filePath: string;
}

/**
 * Plugin with skill paths.
 */
export interface PluginWithSkills {
  name: string;
  path: string;
  source: string;
  manifest?: unknown;
  skillsPath?: string;
  skillsPaths?: string[];
}

/**
 * Loading context.
 */
export interface SkillLoadContext {
  cwd?: string;
  userEnabled?: boolean;
  projectEnabled?: boolean;
}

/**
 * Skill loading result.
 */
export interface SkillLoadResult {
  skillDirCommands: SkillDefinition[];
  pluginSkills: SkillDefinition[];
  bundledSkills: RegisteredSkill[];
}

// ============================================
// Directory Path Utilities
// ============================================

/**
 * Get Claude config directory.
 */
function getClaudeDir(): string {
  return join(homedir(), '.claude');
}

/**
 * Get user skills directory.
 * Original: Q in lO0
 */
function getUserSkillsDir(): string {
  return join(getClaudeDir(), 'skills');
}

/**
 * Get managed/policy skills directory.
 * Original: B in lO0
 */
function getManagedSkillsDir(): string {
  // Default to user's .claude directory if no policy dir set
  const policyDir = process.env.CLAUDE_POLICY_DIR || getClaudeDir();
  return join(policyDir, 'skills');
}

/**
 * Get project skills directories.
 * Original: iO0 in chunks.133.mjs
 */
function getProjectSkillDirs(cwd?: string): string[] {
  const workingDir = cwd || process.cwd();
  const dirs: string[] = [];

  // Check for .claude/skills in current directory
  const projectDir = join(workingDir, '.claude', 'skills');
  if (existsSync(projectDir)) {
    dirs.push(projectDir);
  }

  // Also check for legacy commands directory
  const legacyDir = join(workingDir, '.claude', 'commands');
  if (existsSync(legacyDir)) {
    dirs.push(legacyDir);
  }

  return dirs;
}

// ============================================
// Inode Utilities
// ============================================

/**
 * Get file inode for deduplication.
 * Original: A77 in chunks.133.mjs
 */
function getFileInode(filePath: string): number | null {
  try {
    const stats = statSync(filePath);
    return stats.ino;
  } catch {
    return null;
  }
}

// ============================================
// Directory Scanning
// ============================================

/**
 * Scan a directory for skill files.
 * Original: cO0 in chunks.133.mjs
 *
 * @param dirPath - Directory to scan
 * @param source - Skill source type
 * @returns Array of loaded skill entries
 */
export async function scanSkillDirectory(
  dirPath: string,
  source: SkillSource
): Promise<LoadedSkillEntry[]> {
  const entries: LoadedSkillEntry[] = [];

  if (!existsSync(dirPath)) {
    return entries;
  }

  try {
    const files = readdirSync(dirPath, { withFileTypes: true });

    for (const file of files) {
      const fullPath = join(dirPath, file.name);

      if (file.isDirectory()) {
        // Check for SKILL.md in subdirectory
        const skillPath = join(fullPath, SKILL_CONSTANTS.SKILL_FILENAME);
        if (existsSync(skillPath)) {
          const result = loadSkillFile(skillPath, source);
          if (result) {
            entries.push(result);
          }
        }
      } else if (
        file.name === SKILL_CONSTANTS.SKILL_FILENAME ||
        file.name.endsWith(SKILL_CONSTANTS.SKILL_EXTENSION)
      ) {
        // Direct .md file
        const result = loadSkillFile(fullPath, source);
        if (result) {
          entries.push(result);
        }
      }
    }
  } catch (error) {
    console.error(`[Skills] Failed to scan directory ${dirPath}:`, error);
  }

  return entries;
}

/**
 * Load a single skill file.
 */
function loadSkillFile(
  filePath: string,
  source: SkillSource
): LoadedSkillEntry | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const skill = parseSkillFile(filePath, content);

    if ('error' in skill) {
      console.error(`[Skills] Parse error for ${filePath}:`, skill.error);
      return null;
    }

    return {
      skill: { ...skill, source } as SkillDefinition & { source: SkillSource },
      filePath,
    };
  } catch (error) {
    console.error(`[Skills] Failed to read ${filePath}:`, error);
    return null;
  }
}

// ============================================
// Directory Loading
// ============================================

/**
 * Load skills from all directories (managed, user, project).
 * Original: lO0 in chunks.133.mjs:2069-2096
 *
 * Key features:
 * - Three-tier priority: Managed → User → Project
 * - Inode-based deduplication
 * - Legacy command directory support
 */
export async function loadSkillDirectoryCommands(
  context?: SkillLoadContext
): Promise<SkillDefinition[]> {
  const managedDir = getManagedSkillsDir();
  const userDir = getUserSkillsDir();
  const projectDirs = getProjectSkillDirs(context?.cwd);

  console.log(
    `[Skills] Loading from: managed=${managedDir}, user=${userDir}, project=[${projectDirs.join(', ')}]`
  );

  // Load from all directories in parallel
  const [managedSkills, userSkills, projectSkillsArrays] = await Promise.all([
    // Managed/policy skills (always loaded)
    scanSkillDirectory(managedDir, 'managed'),

    // User skills (if enabled, default true)
    context?.userEnabled !== false
      ? scanSkillDirectory(userDir, 'user')
      : Promise.resolve([]),

    // Project skills (if enabled, default true)
    context?.projectEnabled !== false
      ? Promise.all(projectDirs.map((dir) => scanSkillDirectory(dir, 'project')))
      : Promise.resolve([]),
  ]);

  // Combine all skills
  const allSkills: LoadedSkillEntry[] = [
    ...managedSkills,
    ...userSkills,
    ...projectSkillsArrays.flat(),
  ];

  // Deduplicate by inode
  const inodeMap = new Map<number, string>();
  const uniqueSkills: SkillDefinition[] = [];

  for (const { skill, filePath } of allSkills) {
    // Get file inode
    const inode = getFileInode(filePath);

    // Virtual files (no inode) are always included
    if (inode === null) {
      uniqueSkills.push(skill);
      continue;
    }

    // Check for duplicate
    const existingSource = inodeMap.get(inode);
    if (existingSource !== undefined) {
      console.log(
        `[Skills] Skipping duplicate '${skill.name}' from ${skill.source} (same inode from ${existingSource})`
      );
      continue;
    }

    // Track and include
    inodeMap.set(inode, skill.source);
    uniqueSkills.push(skill);
  }

  const deduplicatedCount = allSkills.length - uniqueSkills.length;
  if (deduplicatedCount > 0) {
    console.log(`[Skills] Deduplicated ${deduplicatedCount} skills (same inode)`);
  }

  console.log(`[Skills] Loaded ${uniqueSkills.length} unique directory skills`);
  return uniqueSkills;
}

// ============================================
// Plugin Skill Loading
// ============================================

/**
 * Load skills from a plugin path.
 * Original: So2 in chunks.130.mjs
 */
export async function loadSkillsFromPath(
  skillPath: string,
  pluginName: string,
  _pluginSource: string,
  _manifest?: unknown,
  _pluginPath?: string,
  seenSkills?: Set<string>
): Promise<SkillDefinition[]> {
  const skills: SkillDefinition[] = [];

  if (!existsSync(skillPath)) {
    return skills;
  }

  try {
    const entries = await scanSkillDirectory(skillPath, 'plugin');

    for (const { skill } of entries) {
      // Skip if already seen
      if (seenSkills?.has(skill.name)) {
        continue;
      }

      seenSkills?.add(skill.name);

      // Add plugin metadata
      const pluginSkill: SkillDefinition = {
        ...skill,
        description: skill.description || `From plugin: ${pluginName}`,
      };

      skills.push(pluginSkill);
    }
  } catch (error) {
    console.error(
      `[Skills] Failed to load from plugin ${pluginName} path ${skillPath}:`,
      error
    );
  }

  return skills;
}

/**
 * Get skills from enabled plugins.
 * Original: tw0 in chunks.130.mjs:1945-1979
 *
 * Note: This function requires plugin integration.
 * Currently returns empty array - plugins should call loadSkillsFromPath directly.
 */
export async function getPluginSkills(
  enabledPlugins?: PluginWithSkills[]
): Promise<SkillDefinition[]> {
  if (!enabledPlugins || enabledPlugins.length === 0) {
    return [];
  }

  const allSkills: SkillDefinition[] = [];

  console.log(`[Skills] Processing ${enabledPlugins.length} enabled plugins`);

  for (const plugin of enabledPlugins) {
    const seenSkills = new Set<string>();

    console.log(
      `[Skills] Checking plugin ${plugin.name}: skillsPath=${plugin.skillsPath ? 'exists' : 'none'}, skillsPaths=${plugin.skillsPaths?.length ?? 0} paths`
    );

    // Load from default skillsPath
    if (plugin.skillsPath) {
      try {
        const skills = await loadSkillsFromPath(
          plugin.skillsPath,
          plugin.name,
          plugin.source,
          plugin.manifest,
          plugin.path,
          seenSkills
        );
        allSkills.push(...skills);
        console.log(
          `[Skills] Loaded ${skills.length} skills from plugin ${plugin.name} default directory`
        );
      } catch (error) {
        console.error(
          `[Skills] Failed to load skills from plugin ${plugin.name} default directory:`,
          error
        );
      }
    }

    // Load from additional skillsPaths
    if (plugin.skillsPaths) {
      for (const skillPath of plugin.skillsPaths) {
        try {
          const skills = await loadSkillsFromPath(
            skillPath,
            plugin.name,
            plugin.source,
            plugin.manifest,
            plugin.path,
            seenSkills
          );
          allSkills.push(...skills);
          console.log(
            `[Skills] Loaded ${skills.length} skills from plugin ${plugin.name} path: ${skillPath}`
          );
        } catch (error) {
          console.error(
            `[Skills] Failed to load skills from plugin ${plugin.name} path ${skillPath}:`,
            error
          );
        }
      }
    }
  }

  console.log(`[Skills] Total plugin skills loaded: ${allSkills.length}`);
  return allSkills;
}

// ============================================
// Bundled Skills
// ============================================

/**
 * Bundled skills registry.
 * Original: vZ9 in chunks.145.mjs
 */
const bundledSkillsRegistry: RegisteredSkill[] = [];

/**
 * Register a bundled skill.
 */
export function registerBundledSkill(skill: RegisteredSkill): void {
  bundledSkillsRegistry.push(skill);
}

/**
 * Get all bundled skills.
 * Original: kZ9 in chunks.145.mjs:1774-1775
 */
export function getBundledSkills(): RegisteredSkill[] {
  return [...bundledSkillsRegistry];
}

/**
 * Clear bundled skills (for testing).
 */
export function clearBundledSkills(): void {
  bundledSkillsRegistry.length = 0;
}

// ============================================
// Main Orchestrator
// ============================================

/**
 * Get all skills from all sources.
 * Original: Wz7 in chunks.146.mjs:2299-2318
 *
 * Combines:
 * 1. Directory skills (managed, user, project)
 * 2. Plugin skills (from enabled plugins)
 * 3. Bundled skills (built-in)
 *
 * Features:
 * - Parallel loading for performance
 * - Error isolation (one source failing doesn't break others)
 * - Graceful degradation
 */
export async function getSkills(
  context?: SkillLoadContext,
  enabledPlugins?: PluginWithSkills[]
): Promise<SkillLoadResult> {
  try {
    // Load directory and plugin skills in parallel
    const [skillDirCommands, pluginSkills] = await Promise.all([
      // Directory skills with error handling
      loadSkillDirectoryCommands(context).catch((error) => {
        console.error(
          '[Skills] Directory commands failed to load:',
          error instanceof Error ? error.message : error
        );
        return [];
      }),

      // Plugin skills with error handling
      getPluginSkills(enabledPlugins).catch((error) => {
        console.error(
          '[Skills] Plugin skills failed to load:',
          error instanceof Error ? error.message : error
        );
        return [];
      }),
    ]);

    // Get bundled skills (synchronous)
    const bundledSkills = getBundledSkills();

    console.log(
      `[Skills] getSkills returning: ${skillDirCommands.length} dir commands, ${pluginSkills.length} plugin skills, ${bundledSkills.length} bundled skills`
    );

    return {
      skillDirCommands,
      pluginSkills,
      bundledSkills,
    };
  } catch (error) {
    console.error(
      '[Skills] Unexpected error in getSkills:',
      error instanceof Error ? error.message : error
    );
    return {
      skillDirCommands: [],
      pluginSkills: [],
      bundledSkills: [],
    };
  }
}

// ============================================
// Cache Management
// ============================================

// Simple memoization cache
let skillsCache: SkillLoadResult | null = null;
let cacheContext: SkillLoadContext | null = null;

/**
 * Get skills with caching.
 */
export async function getSkillsCached(
  context?: SkillLoadContext,
  enabledPlugins?: PluginWithSkills[]
): Promise<SkillLoadResult> {
  // Check if cache is valid
  if (
    skillsCache &&
    cacheContext?.cwd === context?.cwd &&
    cacheContext?.userEnabled === context?.userEnabled &&
    cacheContext?.projectEnabled === context?.projectEnabled
  ) {
    return skillsCache;
  }

  // Load and cache
  skillsCache = await getSkills(context, enabledPlugins);
  cacheContext = context || null;
  return skillsCache;
}

/**
 * Clear skill caches.
 * Original: lt in chunks.133.mjs
 */
export function clearSkillCaches(): void {
  skillsCache = null;
  cacheContext = null;
  console.log('[Skills] Caches cleared');
}

// ============================================
// Export
// ============================================

export {
  // Types
  type SkillSource,
  type LoadedSkillEntry,
  type PluginWithSkills,
  type SkillLoadContext,
  type SkillLoadResult,

  // Directory utilities
  getUserSkillsDir,
  getManagedSkillsDir,
  getProjectSkillDirs,

  // Scanning
  scanSkillDirectory,
  loadSkillsFromPath,

  // Loading
  loadSkillDirectoryCommands,
  getPluginSkills,

  // Bundled
  registerBundledSkill,
  getBundledSkills,
  clearBundledSkills,

  // Orchestrator
  getSkills,
  getSkillsCached,
  clearSkillCaches,
};
