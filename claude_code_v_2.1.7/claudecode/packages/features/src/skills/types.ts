/**
 * @claudecode/features - Skills Types
 *
 * Type definitions for the skill system.
 *
 * IMPORTANT (source alignment): In v2.1.x, “skills” are not a separate runtime
 * system — they are **prompt-type commands** that participate in the unified
 * slash-command pipeline (Aj/Nc/hD1 + RP2/MP2).
 *
 * Source of truth:
 * - chunks.130.mjs: nfA/So2 (plugin skills)
 * - chunks.133.mjs: lO0 (directory skills + inode dedupe + legacy commands)
 * - chunks.146.mjs: Wz7/Aj/Nc/hD1/lt (aggregation & filtering)
 */

import type { PromptCommand } from '../slash-commands/types.js';

// ============================================
// Skill Definition
// ============================================

/**
 * Model options for skill execution.
 */
export type SkillModel = 'sonnet' | 'opus' | 'haiku' | 'inherit' | string;

/**
 * Skill frontmatter (parsed from YAML).
 * Original: NV (parseFrontmatter) in chunks.16.mjs
 */
export interface SkillFrontmatter {
  // Identity
  name?: string;
  description?: string;
  version?: string;

  // Invocation
  when_to_use?: string;
  'when-to-use'?: string;  // Alternative naming
  argument_hint?: string;
  'argument-hint'?: string;

  /** Optional aliases (not part of the minimal NV parser, but supported elsewhere) */
  aliases?: string[];

  /** Execute in forked sub-agent context (source: command.context === "fork") */
  context?: 'fork' | 'main' | string;

  /** Base agent type for fork execution (source: command.agent) */
  agent?: string;

  /** Frontmatter hooks config (shape matches @claudecode/features/hooks) */
  hooks?: unknown;

  // Configuration
  allowed_tools?: string | string[];
  'allowed-tools'?: string | string[];
  model?: SkillModel;
  'disable-model-invocation'?: boolean;
  disableModelInvocation?: boolean;

  /** Restrict direct user invocation (source: command.userInvocable === false blocks /command) */
  'user-invocable'?: boolean;
  userInvocable?: boolean;
}

/**
 * Parsed skill definition.
 */
/**
 * Parsed SKILL.md (file-level representation).
 *
 * NOTE: This is *not* the runtime command object used by the slash-command
 * executor. Use `SkillPromptCommand` for execution.
 */
export interface SkillDefinition {
  // Identity
  name: string;
  description: string;
  version?: string;

  // Source
  filePath: string;
  content: string;

  // Invocation
  whenToUse?: string;
  argumentHint?: string;
  userInvocable: boolean;

  // Configuration
  allowedTools?: string[];
  model?: SkillModel;
  disableModelInvocation: boolean;
}

/**
 * Registered skill (with runtime state).
 */
export interface RegisteredSkill extends SkillDefinition {
  // Runtime
  isEnabled: () => boolean | Promise<boolean>;
  getPromptForCommand?: (args?: string) => string | Promise<string>;

  // Built-in skills
  isBuiltin?: boolean;
}

// ============================================
// Runtime Command Model (Source-Aligned)
// ============================================

/** Where a skill/command was loaded from (source: `loadedFrom`). */
export type LoadedFrom =
  | 'skills'
  | 'plugin'
  | 'bundled'
  | 'commands_DEPRECATED';

/** Source label used for filtering/display (source: `source`). */
export type SkillSource =
  | 'plugin'
  | 'builtin'
  | 'bundled'
  | 'mcp'
  | 'policySettings'
  | 'userSettings'
  | 'projectSettings'
  | string;

/** Plugin metadata carried by plugin-loaded prompt commands. */
export interface PluginInfo {
  pluginManifest: unknown;
  repository: string;
}

/**
 * The runtime shape for a skill (prompt command) in the unified command system.
 *
 * This matches the shape built by `nfA()` in `source/chunks.130.mjs:1656` and
 * expected by aggregators (Aj/Nc/hD1) and executors (RP2/MP2).
 */
export interface SkillPromptCommand extends PromptCommand {
  type: 'prompt';

  // Classification
  source: SkillSource;
  loadedFrom: LoadedFrom;

  // Metadata
  hasUserSpecifiedDescription?: boolean;
  whenToUse?: string;
  version?: string;

  // Behavior
  disableModelInvocation?: boolean;
  userInvocable?: boolean;
  progressMessage?: string;

  // Optional integrations
  pluginInfo?: PluginInfo;
  /** Skill mode injects base directory into prompt (source: pt(filePath)). */
  baseDir?: string;
}

// ============================================
// Skill Loading
// ============================================

/**
 * Skill loading options.
 */
export interface SkillLoadOptions {
  // Directories to scan
  directories?: string[];

  // Include built-in skills
  includeBuiltin?: boolean;

  // Enable caching
  enableCache?: boolean;
}

/**
 * Loaded skill result.
 */
export interface LoadedSkill {
  skill: SkillDefinition;
  errors?: string[];
}

/**
 * Skill discovery result.
 */
export interface SkillDiscoveryResult {
  skills: SkillDefinition[];
  errors: Array<{ path: string; error: string }>;
}

// ============================================
// Skill Execution
// ============================================

/**
 * Skill execution context.
 */
export interface SkillExecutionContext {
  skillName: string;
  arguments?: string;
  model?: SkillModel;
  allowedTools?: string[];
}

/**
 * Skill execution result.
 */
export interface SkillExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  toolsUsed?: string[];
}

// ============================================
// Skill Registry
// ============================================

/**
 * Skill registry state.
 */
export interface SkillRegistry {
  skills: Map<string, RegisteredSkill>;
  builtinSkills: Set<string>;
}

// ============================================
// Constants
// ============================================

export const SKILL_CONSTANTS = {
  // File patterns
  SKILL_FILENAME: 'SKILL.md',
  SKILL_EXTENSION: '.md',

  // Directories
  PROJECT_SKILLS_DIR: '.claude/skills',
  USER_SKILLS_DIR: '~/.claude/skills',

  // Placeholders
  ARGUMENTS_PLACEHOLDER: '$ARGUMENTS',

  // Frontmatter markers
  FRONTMATTER_START: '---',
  FRONTMATTER_END: '---',

  // Default values
  DEFAULT_MODEL: 'inherit' as SkillModel,

  // Built-in skills
  BUILTIN_SKILLS: [
    'claude-in-chrome',
    'commit',
    'review-pr',
    'pdf',
  ] as const,
} as const;

// ============================================
// Export
// ============================================

// NOTE: 类型已在声明处导出；移除重复聚合导出以避免 TS2484。
