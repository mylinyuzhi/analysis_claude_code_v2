/**
 * @claudecode/features - Skills Module
 *
 * Skill loading, parsing, and execution system.
 *
 * Key features:
 * - SKILL.md file parsing with YAML frontmatter
 * - Skill discovery from project and user directories
 * - LLM and user invocable skill support
 * - Argument injection via $ARGUMENTS placeholder
 *
 * Reconstructed from chunks.130.mjs, chunks.133.mjs, chunks.146.mjs
 */

// ============================================
// Types
// ============================================

export * from './types.js';

// ============================================
// Parser
// ============================================

export {
  parseFrontmatter,
  extractFirstHeading,
  parseSkillFile,
  injectArguments,
  hasArgumentsPlaceholder,
} from './parser.js';

// ============================================
// Registry
// ============================================

export {
  SkillRegistry,
  loadSkillsFromDirectory,
  discoverSkills,
  toRegisteredSkill,
  getSkillRegistry,
  resetSkillRegistry,
  initializeSkills,
} from './registry.js';
