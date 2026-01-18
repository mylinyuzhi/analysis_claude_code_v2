/**
 * @claudecode/features - Skills Types
 *
 * Type definitions for the skill system.
 * Reconstructed from chunks.130.mjs, chunks.133.mjs, chunks.146.mjs
 */

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

  // Configuration
  allowed_tools?: string | string[];
  'allowed-tools'?: string | string[];
  model?: SkillModel;
  'disable-model-invocation'?: boolean;
  disableModelInvocation?: boolean;
}

/**
 * Parsed skill definition.
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

export type {
  SkillModel,
  SkillFrontmatter,
  SkillDefinition,
  RegisteredSkill,
  SkillLoadOptions,
  LoadedSkill,
  SkillDiscoveryResult,
  SkillExecutionContext,
  SkillExecutionResult,
  SkillRegistry,
};
