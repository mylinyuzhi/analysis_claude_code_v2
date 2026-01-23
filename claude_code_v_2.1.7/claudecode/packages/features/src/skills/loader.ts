/**
 * @claudecode/features - Skill Loader (Source-aligned)
 *
 * IMPORTANT: In v2.1.x, “skills” are prompt-type slash commands.
 * This module reconstructs the multi-source loading pipeline and builds
 * prompt commands compatible with the unified slash-command executor.
 *
 * Source of truth:
 * - `source/chunks.133.mjs`: cO0 (skills dir scan), Y77 (legacy commands), lO0 (dir orchestrator)
 * - `source/chunks.130.mjs`: So2/nfA (plugin skills)
 * - `source/chunks.146.mjs`: Wz7 (getSkills)
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join, dirname, basename } from 'path';
import { homedir } from 'os';
import type { SlashCommand, CommandContent } from '../slash-commands/types.js';
import type { EventHooksConfig } from '../hooks/types.js';
import type { SkillPromptCommand, PluginInfo, LoadedFrom, SkillSource } from './types.js';
import { SKILL_CONSTANTS } from './types.js';
import { parseFrontmatter, extractFirstHeading, buildSkillPromptText } from './parser.js';
import { getAllBuiltinCommands } from '../slash-commands/registry.js';

// ============================================
// Types
// ============================================

/**
 * Directory-origin source labels (matches source strings).
 * - `policySettings` / `userSettings` / `projectSettings` are used for skills & legacy commands.
 */
export type DirectoryCommandSource = 'policySettings' | 'userSettings' | 'projectSettings';

/** Loaded prompt command with its filePath (for inode-based dedupe). */
export interface LoadedSkillEntry {
  skill: SkillPromptCommand;
  filePath: string;
}

/**
 * Plugin with skill paths.
 */
export interface PluginWithSkills {
  name: string;
  path: string;
  /** Repository / identifier (source: `repository` in pluginInfo). */
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
  skillDirCommands: SkillPromptCommand[];
  pluginSkills: SkillPromptCommand[];
  bundledSkills: SlashCommand[];
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
 * Policy root directory.
 * Source alignment: managed skills use `join(policyRoot, ".claude", "skills")`.
 */
function getPolicyRootDir(): string {
  return process.env.CLAUDE_POLICY_DIR || homedir();
}

/**
 * Get user skills directory.
 * Original: Q in lO0
 */
export function getUserSkillsDir(): string {
  return join(getClaudeDir(), 'skills');
}

/**
 * Get managed/policy skills directory.
 * Original: B in lO0
 */
export function getManagedSkillsDir(): string {
  // Source-aligned layout: <policyRoot>/.claude/skills
  return join(getPolicyRootDir(), '.claude', 'skills');
}

/**
 * Get project skills directories.
 * Original: iO0 in chunks.133.mjs
 */
export function getProjectSkillDirs(cwd?: string): string[] {
  return findProjectConfigDirs('skills', cwd);
}

function findProjectConfigDirs(configLeaf: 'skills' | 'commands', cwd?: string): string[] {
  const start = cwd || process.cwd();
  const out: string[] = [];
  const seen = new Set<string>();

  let current = start;
  // Walk upwards until filesystem root.
  while (true) {
    const candidate = join(current, '.claude', configLeaf);
    if (existsSync(candidate) && !seen.has(candidate)) {
      out.push(candidate);
      seen.add(candidate);
    }

    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }

  return out;
}

// ============================================
// Inode Utilities
// ============================================

/**
 * Get inode key for deduplication.
 * Source alignment: `A77()` returns `${dev}:${ino}` and returns null on failure.
 */
function getFileInodeKey(filePath: string): string | null {
  try {
    const stats = statSync(filePath);
    return `${stats.dev}:${stats.ino}`;
  } catch {
    return null;
  }
}

function parseBooleanFrontmatter(value: unknown, defaultValue: boolean): boolean {
  if (value === undefined || value === null) return defaultValue;
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return defaultValue;
}

/**
 * Minimal `allowed-tools` parser.
 * Source alignment: RS() handles "*" and expression tokenization.
 */
function parseAllowedToolsFrontmatter(raw: unknown): string[] | undefined {
  if (raw === undefined || raw === null) return undefined;

  if (Array.isArray(raw)) {
    const vals = raw.filter((x): x is string => typeof x === 'string');
    return vals.length > 0 ? vals : undefined;
  }

  if (typeof raw !== 'string') return undefined;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === '*') return undefined;

  // JSON array string (common for plugin manifests).
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
        return parsed as string[];
      }
    } catch {
      // fall through
    }
  }

  // Split by commas/spaces outside parentheses.
  const result: string[] = [];
  let current = '';
  let depth = 0;
  const push = () => {
    const t = current.trim();
    if (t) result.push(t);
    current = '';
  };

  for (const ch of trimmed) {
    if (ch === '(') {
      depth++;
      current += ch;
      continue;
    }
    if (ch === ')') {
      depth = Math.max(0, depth - 1);
      current += ch;
      continue;
    }
    if ((ch === ',' || ch === ' ') && depth === 0) {
      push();
      continue;
    }
    current += ch;
  }
  push();
  return result.length > 0 ? result : undefined;
}

function replacePluginRootPlaceholders(text: string, pluginRoot: string): string {
  return text.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, pluginRoot);
}

/**
 * Parse `hooks` frontmatter.
 * Source alignment: SA9() validates against the hooks schema; here we accept JSON-only.
 */
function parseHooksFrontmatter(raw: unknown, skillNameForLog: string): EventHooksConfig | undefined {
  if (raw === undefined || raw === null) return undefined;

  let parsed: unknown = raw;
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return undefined;
    try {
      parsed = JSON.parse(trimmed);
    } catch (err) {
      console.warn(`[Skills] Invalid hooks JSON in skill '${skillNameForLog}': ${String(err)}`);
      return undefined;
    }
  }

  if (!parsed || typeof parsed !== 'object') {
    console.warn(`[Skills] Invalid hooks in skill '${skillNameForLog}': expected object`);
    return undefined;
  }
  return parsed as EventHooksConfig;
}

function markdownTitleOrDefault(markdown: string, fallback: string): string {
  return extractFirstHeading(markdown) ?? fallback;
}

function createPromptCommand(params: {
  name: string;
  displayName?: string;
  description: string;
  hasUserSpecifiedDescription: boolean;
  markdownContent: string;
  allowedTools?: string[];
  argumentHint?: string;
  whenToUse?: string;
  version?: string;
  model?: string;
  disableModelInvocation?: boolean;
  userInvocable?: boolean;
  source: SkillSource;
  baseDir?: string;
  loadedFrom: LoadedFrom;
  hooks?: EventHooksConfig;
  executionContext?: 'fork';
  agent?: string;
  pluginInfo?: PluginInfo;
  progressMessage?: string;
  isHidden?: boolean;
}): SkillPromptCommand {
  const {
    name,
    displayName,
    description,
    hasUserSpecifiedDescription,
    markdownContent,
    allowedTools,
    argumentHint,
    whenToUse,
    version,
    model,
    disableModelInvocation,
    userInvocable,
    source,
    baseDir,
    loadedFrom,
    hooks,
    executionContext,
    agent,
    pluginInfo,
    progressMessage,
    isHidden,
  } = params;

  return {
    type: 'prompt',
    name,
    description,
    hasUserSpecifiedDescription,
    allowedTools,
    argumentHint,
    whenToUse,
    version,
    model,
    disableModelInvocation,
    userInvocable,
    context: executionContext,
    agent,
    isEnabled: () => true,
    isHidden: isHidden ?? userInvocable === false,
    progressMessage: progressMessage ?? 'running',
    userFacingName: () => displayName || name,
    source,
    loadedFrom,
    hooks,
    pluginInfo,
    baseDir,
    async getPromptForCommand(args: string, _context: any): Promise<CommandContent[]> {
      const text = buildSkillPromptText({
        rawContent: markdownContent,
        baseDir,
        args,
        isSkillMode: Boolean(baseDir),
      });
      return [{ type: 'text', text }];
    },
  };
}

// ============================================
// Directory Scanning
// ============================================

/**
 * Scan a skills directory (one level deep) for `SKILL.md` entries.
 * Source alignment: cO0 only considers subdirectories/symlinks containing `SKILL.md`.
 */
export async function scanSkillDirectory(
  dirPath: string,
  source: DirectoryCommandSource
): Promise<LoadedSkillEntry[]> {
  const entries: LoadedSkillEntry[] = [];
  if (!existsSync(dirPath)) return entries;

  try {
    const children = readdirSync(dirPath, { withFileTypes: true });
    for (const child of children) {
      if (!child.isDirectory() && !child.isSymbolicLink()) continue;

      const skillDir = join(dirPath, child.name);
      const skillFile = join(skillDir, SKILL_CONSTANTS.SKILL_FILENAME);
      if (!existsSync(skillFile)) continue;

      try {
        const raw = readFileSync(skillFile, { encoding: 'utf-8' });
        const { frontmatter, content } = parseFrontmatter(raw);

        const description =
          (frontmatter as any).description ??
          markdownTitleOrDefault(content, 'Skill');
        const allowedTools = parseAllowedToolsFrontmatter((frontmatter as any)['allowed-tools']);
        const userInvocable =
          (frontmatter as any)['user-invocable'] === undefined
            ? true
            : parseBooleanFrontmatter((frontmatter as any)['user-invocable'], true);
        const disableModelInvocation = parseBooleanFrontmatter(
          (frontmatter as any)['disable-model-invocation'],
          false
        );
        const model = (frontmatter as any).model === 'inherit' ? undefined : (frontmatter as any).model;
        const hooks = parseHooksFrontmatter((frontmatter as any).hooks, child.name);
        const executionContext = (frontmatter as any).context === 'fork' ? 'fork' : undefined;
        const agent = (frontmatter as any).agent;

        const skill = createPromptCommand({
          name: child.name,
          displayName: (frontmatter as any).name,
          description,
          hasUserSpecifiedDescription: Boolean((frontmatter as any).description),
          markdownContent: content,
          allowedTools,
          argumentHint: (frontmatter as any)['argument-hint'],
          whenToUse: (frontmatter as any).when_to_use,
          version: (frontmatter as any).version,
          model,
          disableModelInvocation,
          userInvocable,
          source,
          baseDir: skillDir,
          loadedFrom: 'skills',
          hooks,
          executionContext,
          agent,
          progressMessage: 'running',
          isHidden: !userInvocable,
        });

        entries.push({ skill, filePath: skillFile });
      } catch (err) {
        console.error(`[Skills] Failed to load skill from ${skillFile}:`, err);
      }
    }
  } catch (err) {
    console.error(`[Skills] Failed to scan directory ${dirPath}:`, err);
  }

  return entries;
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
): Promise<SkillPromptCommand[]> {
  const managedDir = getManagedSkillsDir();
  const userDir = getUserSkillsDir();
  const projectDirs = getProjectSkillDirs(context?.cwd);

  console.log(
    `[Skills] Loading from: managed=${managedDir}, user=${userDir}, project=[${projectDirs.join(', ')}]`
  );

  // Load from all directories in parallel
  const [managedSkills, userSkills, projectSkillsArrays, legacyCommands] = await Promise.all([
    scanSkillDirectory(managedDir, 'policySettings'),
    context?.userEnabled !== false
      ? scanSkillDirectory(userDir, 'userSettings')
      : Promise.resolve([]),
    context?.projectEnabled !== false
      ? Promise.all(projectDirs.map((dir) => scanSkillDirectory(dir, 'projectSettings')))
      : Promise.resolve([]),
    loadLegacyCommands(context),
  ]);

  // Combine all skills
  const allSkills: LoadedSkillEntry[] = [
    ...managedSkills,
    ...userSkills,
    ...projectSkillsArrays.flat(),
    ...legacyCommands,
  ];

  // Deduplicate by inode
  const inodeMap = new Map<string, string>();
  const uniqueSkills: SkillPromptCommand[] = [];

  for (const { skill, filePath } of allSkills) {
    if (skill.type !== 'prompt') continue;

    const inodeKey = getFileInodeKey(filePath);
    if (inodeKey === null) {
      uniqueSkills.push(skill);
      continue;
    }

    const existingSource = inodeMap.get(inodeKey);
    if (existingSource !== undefined) {
      console.log(
        `[Skills] Skipping duplicate skill '${skill.name}' from ${skill.source} (same inode already loaded from ${existingSource})`
      );
      continue;
    }

    inodeMap.set(inodeKey, String(skill.source));
    uniqueSkills.push(skill);
  }

  const deduplicatedCount = allSkills.length - uniqueSkills.length;
  if (deduplicatedCount > 0) {
    console.log(`[Skills] Deduplicated ${deduplicatedCount} skills (same inode)`);
  }

  console.log(
    `[Skills] Loaded ${uniqueSkills.length} unique skills (managed: ${managedSkills.length}, user: ${userSkills.length}, project: ${projectSkillsArrays.flat().length}, legacy commands: ${legacyCommands.length})`
  );
  return uniqueSkills;
}

// ============================================
// Legacy `.claude/commands` loading (commands_DEPRECATED)
// ============================================

interface LegacyMarkdownFile {
  baseDir: string;
  filePath: string;
  frontmatter: Record<string, unknown>;
  content: string;
  source: DirectoryCommandSource;
}

async function loadLegacyMarkdownFiles(
  baseDir: string,
  source: DirectoryCommandSource
): Promise<LegacyMarkdownFile[]> {
  const out: LegacyMarkdownFile[] = [];
  if (!existsSync(baseDir)) return out;

  const walk = (dir: string) => {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = join(dir, ent.name);
      if (ent.isDirectory() || ent.isSymbolicLink()) {
        walk(full);
        continue;
      }
      if (!/\.md$/i.test(ent.name)) continue;

      try {
        const raw = readFileSync(full, { encoding: 'utf-8' });
        const { frontmatter, content } = parseFrontmatter(raw);
        out.push({
          baseDir,
          filePath: full,
          frontmatter: frontmatter as Record<string, unknown>,
          content,
          source,
        });
      } catch (err) {
        console.error(`[Skills] Failed to read legacy command ${full}:`, err);
      }
    }
  };

  try {
    walk(baseDir);
  } catch (err) {
    console.error(`[Skills] Failed to scan legacy commands dir ${baseDir}:`, err);
  }
  return out;
}

function isSkillMdPath(filePath: string): boolean {
  return /^skill\.md$/i.test(basename(filePath));
}

/**
 * Source alignment: Q77() groups by directory and prefers `SKILL.md` if present.
 */
function preferSkillMdWithinFolder(files: LegacyMarkdownFile[]): LegacyMarkdownFile[] {
  const byDir = new Map<string, LegacyMarkdownFile[]>();
  for (const f of files) {
    const dir = dirname(f.filePath);
    const list = byDir.get(dir) ?? [];
    list.push(f);
    byDir.set(dir, list);
  }

  const out: LegacyMarkdownFile[] = [];
  for (const [dir, group] of byDir.entries()) {
    const skillFiles = group.filter((g) => isSkillMdPath(g.filePath));
    if (skillFiles.length > 0) {
      const chosen = skillFiles[0]!;
      if (skillFiles.length > 1) {
        console.log(
          `[Skills] Multiple skill files found in ${dir}, using ${basename(chosen.filePath)}`
        );
      }
      out.push(chosen);
    } else {
      out.push(...group);
    }
  }
  return out;
}

function relativePathLabel(pathToDir: string, baseDir: string): string {
  const base = baseDir.replace(/[/\\]+$/, '');
  if (pathToDir === base) return '';
  const rest = pathToDir.slice(base.length + 1);
  return rest ? rest.split(/[/\\]/).join(':') : '';
}

function legacyCommandName(filePath: string, baseDir: string): string {
  if (isSkillMdPath(filePath)) {
    const folder = dirname(filePath);
    const parent = dirname(folder);
    const leaf = basename(folder);
    const prefix = relativePathLabel(parent, baseDir);
    return prefix ? `${prefix}:${leaf}` : leaf;
  }

  const dir = dirname(filePath);
  const leaf = basename(filePath).replace(/\.md$/i, '');
  const prefix = relativePathLabel(dir, baseDir);
  return prefix ? `${prefix}:${leaf}` : leaf;
}

async function loadLegacyCommands(context?: SkillLoadContext): Promise<LoadedSkillEntry[]> {
  try {
    const managed = join(getPolicyRootDir(), '.claude', 'commands');
    const user = join(getClaudeDir(), 'commands');
    const projectDirs = findProjectConfigDirs('commands', context?.cwd);

    const [managedFiles, userFiles, projectFilesArrays] = await Promise.all([
      loadLegacyMarkdownFiles(managed, 'policySettings'),
      context?.userEnabled !== false
        ? loadLegacyMarkdownFiles(user, 'userSettings')
        : Promise.resolve([]),
      context?.projectEnabled !== false
        ? Promise.all(projectDirs.map((d) => loadLegacyMarkdownFiles(d, 'projectSettings')))
        : Promise.resolve([]),
    ]);

    const allFiles = [...managedFiles, ...userFiles, ...projectFilesArrays.flat()];
    const chosen = preferSkillMdWithinFolder(allFiles);

    const out: LoadedSkillEntry[] = [];
    for (const file of chosen) {
      try {
        const fm = file.frontmatter as any;
        const name = legacyCommandName(file.filePath, file.baseDir);
        const description = fm.description ?? markdownTitleOrDefault(file.content, 'Custom command');
        const allowedTools = parseAllowedToolsFrontmatter(fm['allowed-tools']);
        const userInvocable =
          fm['user-invocable'] === undefined
            ? true
            : parseBooleanFrontmatter(fm['user-invocable'], true);
        const disableModelInvocation = parseBooleanFrontmatter(
          fm['disable-model-invocation'],
          false
        );
        const model = fm.model === 'inherit' ? undefined : fm.model;
        const executionContext = fm.context === 'fork' ? 'fork' : undefined;
        const agent = fm.agent;
        const baseDir = isSkillMdPath(file.filePath) ? dirname(file.filePath) : undefined;
        const hooks = parseHooksFrontmatter(fm.hooks, name);

        const skill = createPromptCommand({
          name,
          displayName: undefined,
          description,
          hasUserSpecifiedDescription: Boolean(fm.description),
          markdownContent: file.content,
          allowedTools,
          argumentHint: fm['argument-hint'],
          whenToUse: fm.when_to_use,
          version: fm.version,
          model,
          disableModelInvocation,
          userInvocable,
          source: file.source,
          baseDir,
          loadedFrom: 'commands_DEPRECATED',
          hooks,
          executionContext,
          agent,
          progressMessage: 'running',
          isHidden: !userInvocable,
        });

        out.push({ skill, filePath: file.filePath });
      } catch (err) {
        console.error(`[Skills] Failed to build legacy command from ${file.filePath}:`, err);
      }
    }

    return out;
  } catch (err) {
    console.error(`[Skills] Failed to load legacy commands:`, err);
    return [];
  }
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
  pluginRepository: string,
  pluginManifest?: unknown,
  pluginRoot?: string,
  seenInodes?: Set<string>
): Promise<SkillPromptCommand[]> {
  const out: SkillPromptCommand[] = [];
  if (!existsSync(skillPath)) return out;

  const pluginInfo: PluginInfo = {
    pluginManifest: pluginManifest,
    repository: pluginRepository,
  };

  const shouldSkipByInode = (filePath: string): boolean => {
    if (!seenInodes) return false;
    const key = getFileInodeKey(filePath);
    if (!key) return false;
    if (seenInodes.has(key)) return true;
    seenInodes.add(key);
    return false;
  };

  try {
    // Source alignment: So2() supports a direct `SKILL.md` at the root of skillPath.
    const rootSkillFile = join(skillPath, 'SKILL.md');
    if (existsSync(rootSkillFile)) {
      if (shouldSkipByInode(rootSkillFile)) return out;

      const raw = readFileSync(rootSkillFile, { encoding: 'utf-8' });
      const { frontmatter, content } = parseFrontmatter(raw);
      const fm = frontmatter as any;

      const name = `${pluginName}:${basename(skillPath)}`;
      const description = fm.description ?? markdownTitleOrDefault(content, 'Plugin skill');
      const allowedToolsRaw = fm['allowed-tools'];
      const allowedTools = parseAllowedToolsFrontmatter(
        typeof allowedToolsRaw === 'string' && pluginRoot
          ? replacePluginRootPlaceholders(allowedToolsRaw, pluginRoot)
          : allowedToolsRaw
      );
      const model = fm.model === 'inherit' ? undefined : fm.model;
      const disableModelInvocation =
        fm['disable-model-invocation'] === undefined
          ? false
          : parseBooleanFrontmatter(fm['disable-model-invocation'], false);

      const skill = createPromptCommand({
        name,
        displayName: fm.name,
        description,
        hasUserSpecifiedDescription: Boolean(fm.description),
        markdownContent: pluginRoot ? replacePluginRootPlaceholders(content, pluginRoot) : content,
        allowedTools,
        argumentHint: fm['argument-hint'],
        whenToUse: fm.when_to_use,
        version: fm.version,
        model,
        disableModelInvocation,
        userInvocable: false,
        source: 'plugin',
        baseDir: dirname(rootSkillFile),
        loadedFrom: 'plugin',
        pluginInfo,
        progressMessage: 'loading',
        isHidden: true,
      });
      out.push(skill);
      return out;
    }

    // Otherwise, scan one level of child dirs/symlinks for `SKILL.md`.
    const children = readdirSync(skillPath, { withFileTypes: true });
    for (const child of children) {
      if (!child.isDirectory() && !child.isSymbolicLink()) continue;

      const childDir = join(skillPath, child.name);
      const skillFile = join(childDir, 'SKILL.md');
      if (!existsSync(skillFile)) continue;
      if (shouldSkipByInode(skillFile)) continue;

      try {
        const raw = readFileSync(skillFile, { encoding: 'utf-8' });
        const { frontmatter, content } = parseFrontmatter(raw);
        const fm = frontmatter as any;
        const name = `${pluginName}:${child.name}`;

        const description = fm.description ?? markdownTitleOrDefault(content, 'Plugin skill');
        const allowedToolsRaw = fm['allowed-tools'];
        const allowedTools = parseAllowedToolsFrontmatter(
          typeof allowedToolsRaw === 'string' && pluginRoot
            ? replacePluginRootPlaceholders(allowedToolsRaw, pluginRoot)
            : allowedToolsRaw
        );
        const model = fm.model === 'inherit' ? undefined : fm.model;
        const disableModelInvocation =
          fm['disable-model-invocation'] === undefined
            ? false
            : parseBooleanFrontmatter(fm['disable-model-invocation'], false);

        const skill = createPromptCommand({
          name,
          displayName: fm.name,
          description,
          hasUserSpecifiedDescription: Boolean(fm.description),
          markdownContent: pluginRoot ? replacePluginRootPlaceholders(content, pluginRoot) : content,
          allowedTools,
          argumentHint: fm['argument-hint'],
          whenToUse: fm.when_to_use,
          version: fm.version,
          model,
          disableModelInvocation,
          userInvocable: false,
          source: 'plugin',
          baseDir: dirname(skillFile),
          loadedFrom: 'plugin',
          pluginInfo,
          progressMessage: 'loading',
          isHidden: true,
        });
        out.push(skill);
      } catch (err) {
        console.error(`[Skills] Failed to load skill from ${skillFile}:`, err);
      }
    }
  } catch (err) {
    console.error(`[Skills] Failed to load from plugin ${pluginName} path ${skillPath}:`, err);
  }

  return out;
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
): Promise<SkillPromptCommand[]> {
  if (!enabledPlugins || enabledPlugins.length === 0) {
    return [];
  }

  const allSkills: SkillPromptCommand[] = [];

  console.log(`[Skills] Processing ${enabledPlugins.length} enabled plugins`);

  for (const plugin of enabledPlugins) {
    const seenInodes = new Set<string>();

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
          seenInodes
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
            seenInodes
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
 * Bundled commands registry.
 * Source alignment: kZ9() returns a shallow copy of a module-level array.
 */
const bundledCommandsRegistry: SlashCommand[] = [];

export function registerBundledSkill(skill: SlashCommand): void {
  bundledCommandsRegistry.push(skill);
}

/**
 * Get all bundled skills.
 * Original: kZ9 in chunks.145.mjs:1774-1775
 */
export function getBundledSkills(): SlashCommand[] {
  return [...bundledCommandsRegistry];
}

/**
 * Clear bundled skills (for testing).
 */
export function clearBundledSkills(): void {
  bundledCommandsRegistry.length = 0;
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
let cachePluginKey: string | null = null;

function pluginCacheKey(plugins?: PluginWithSkills[]): string {
  if (!plugins || plugins.length === 0) return '';
  return plugins
    .map((p) => `${p.name}|${p.path}|${p.source}|${p.skillsPath ?? ''}|${(p.skillsPaths ?? []).join(',')}`)
    .sort()
    .join(';');
}

/**
 * Get skills with caching.
 */
export async function getSkillsCached(
  context?: SkillLoadContext,
  enabledPlugins?: PluginWithSkills[]
): Promise<SkillLoadResult> {
  // Check if cache is valid
  const pk = pluginCacheKey(enabledPlugins);
  if (
    skillsCache &&
    cacheContext?.cwd === context?.cwd &&
    cacheContext?.userEnabled === context?.userEnabled &&
    cacheContext?.projectEnabled === context?.projectEnabled &&
    cachePluginKey === pk
  ) {
    return skillsCache;
  }

  // Load and cache
  skillsCache = await getSkills(context, enabledPlugins);
  cacheContext = context || null;
  cachePluginKey = pk;
  return skillsCache;
}

/**
 * Clear skill caches.
 * Original: lt in chunks.133.mjs
 */
export function clearSkillCaches(): void {
  skillsCache = null;
  cacheContext = null;
  cachePluginKey = null;
  console.log('[Skills] Caches cleared');
}

// ============================================
// Aggregation & Filtering (Source-aligned)
// ============================================

export interface GetAllCommandsContext extends SkillLoadContext {
  enabledPlugins?: PluginWithSkills[];
  /** Plugin commands loaded from plugins' commandsPath(s) (source: z3A()). */
  pluginCommands?: SlashCommand[];
  /** MCP prompts/commands (source: Dz7()). */
  mcpPrompts?: SlashCommand[];
  /** Extra dynamic commands/skills injected by runtime. */
  dynamicSkills?: SlashCommand[];
  /** Override builtin commands list (defaults to `getAllBuiltinCommands()`). */
  builtinCommands?: SlashCommand[];
}

function createMemoizedAsync<TArg, TResult>(
  fn: (arg: TArg) => Promise<TResult>,
  keyFn: (arg: TArg) => string
): ((arg: TArg) => Promise<TResult>) & { cache: { clear: () => void } } {
  const cache = new Map<string, Promise<TResult>>();

  const wrapped = (async (arg: TArg) => {
    const key = keyFn(arg);
    const existing = cache.get(key);
    if (existing) return existing;
    const p = fn(arg);
    cache.set(key, p);
    return p;
  }) as ((arg: TArg) => Promise<TResult>) & { cache: { clear: () => void } };

  wrapped.cache = {
    clear: () => cache.clear(),
  };

  return wrapped;
}

function commandContextKey(ctx: GetAllCommandsContext): string {
  return [
    ctx.cwd ?? '',
    String(ctx.userEnabled ?? true),
    String(ctx.projectEnabled ?? true),
    pluginCacheKey(ctx.enabledPlugins),
    String(ctx.pluginCommands?.length ?? 0),
    String(ctx.mcpPrompts?.length ?? 0),
    String(ctx.dynamicSkills?.length ?? 0),
    String(ctx.builtinCommands?.length ?? 0),
  ].join('|');
}

/**
 * Return all enabled commands.
 * Source alignment: Aj() in `source/chunks.146.mjs:2448`.
 */
export const getAllCommands = createMemoizedAsync(
  async (ctx: GetAllCommandsContext): Promise<SlashCommand[]> => {
    const { enabledPlugins, pluginCommands, mcpPrompts, dynamicSkills, builtinCommands } = ctx;
    const { skillDirCommands, pluginSkills, bundledSkills } = await getSkillsCached(
      {
        cwd: ctx.cwd,
        userEnabled: ctx.userEnabled,
        projectEnabled: ctx.projectEnabled,
      },
      enabledPlugins
    );

    const builtins = builtinCommands ?? getAllBuiltinCommands();
    return [
      ...bundledSkills,
      ...skillDirCommands,
      ...(pluginCommands ?? []),
      ...pluginSkills,
      ...(mcpPrompts ?? []),
      ...(dynamicSkills ?? []),
      ...builtins,
    ].filter((c) => c.isEnabled());
  },
  commandContextKey
);

/**
 * Return LLM-invocable skills.
 * Source alignment: Nc() in `source/chunks.146.mjs:2456-2457`.
 */
export const getLLMInvocableSkills = createMemoizedAsync(
  async (ctx: GetAllCommandsContext): Promise<SkillPromptCommand[]> => {
    const all = await getAllCommands(ctx);
    return all.filter((c): c is SkillPromptCommand => {
      if (c.type !== 'prompt') return false;
      const pc = c as SkillPromptCommand;
      return (
        !pc.disableModelInvocation &&
        pc.source !== 'builtin' &&
        (pc.loadedFrom === 'bundled' ||
          pc.loadedFrom === 'commands_DEPRECATED' ||
          pc.hasUserSpecifiedDescription ||
          Boolean(pc.whenToUse))
      );
    });
  },
  commandContextKey
);

/**
 * Return user-visible skills for `/help`.
 * Source alignment: hD1() in `source/chunks.146.mjs:2458-2463`.
 */
export const getUserSkills = createMemoizedAsync(
  async (ctx: GetAllCommandsContext): Promise<SkillPromptCommand[]> => {
    try {
      const all = await getAllCommands(ctx);
      return all.filter((c): c is SkillPromptCommand => {
        if (c.type !== 'prompt') return false;
        const pc = c as SkillPromptCommand;
        return (
          pc.source !== 'builtin' &&
          (pc.hasUserSpecifiedDescription || Boolean(pc.whenToUse)) &&
          (pc.loadedFrom === 'skills' ||
            pc.loadedFrom === 'plugin' ||
            pc.loadedFrom === 'bundled' ||
            Boolean(pc.disableModelInvocation))
        );
      });
    } catch (err) {
      console.error(
        err instanceof Error ? err : new Error('Failed to load slash command skills')
      );
      console.log('[Skills] Returning empty skills array due to load failure');
      return [];
    }
  },
  commandContextKey
);

/**
 * Clear caches for command aggregation and skill loading.
 * Source alignment: lt() in `source/chunks.146.mjs:2320-2321`.
 */
export function clearAllCommandCaches(): void {
  getAllCommands.cache.clear();
  getLLMInvocableSkills.cache.clear();
  getUserSkills.cache.clear();
  clearSkillCaches();
}

// ============================================
// Export
// ============================================

// NOTE: 类型/函数已在声明处导出；移除重复聚合导出。
