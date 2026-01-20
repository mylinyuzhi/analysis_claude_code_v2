/**
 * @claudecode/features - Skill Registry
 *
 * Registry for managing loaded skills.
 * Reconstructed from chunks.130.mjs, chunks.133.mjs
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import type {
  SkillDefinition,
  RegisteredSkill,
  SkillDiscoveryResult,
  SkillLoadOptions,
} from './types.js';
import { SKILL_CONSTANTS } from './types.js';
import { parseSkillFile, injectArguments } from './parser.js';

// ============================================
// Skill Registry
// ============================================

/**
 * Skill registry class.
 * Manages loaded skills and provides lookup functionality.
 */
export class SkillRegistry {
  private skills: Map<string, RegisteredSkill> = new Map();
  private builtinSkills: Set<string> = new Set();

  /**
   * Register a skill.
   */
  register(skill: RegisteredSkill): void {
    this.skills.set(skill.name, skill);
    if (skill.isBuiltin) {
      this.builtinSkills.add(skill.name);
    }
  }

  /**
   * Unregister a skill.
   */
  unregister(name: string): boolean {
    this.builtinSkills.delete(name);
    return this.skills.delete(name);
  }

  /**
   * Get skill by name.
   */
  get(name: string): RegisteredSkill | undefined {
    return this.skills.get(name);
  }

  /**
   * Check if skill exists.
   */
  has(name: string): boolean {
    return this.skills.has(name);
  }

  /**
   * Get all skills.
   */
  getAll(): RegisteredSkill[] {
    return Array.from(this.skills.values());
  }

  /**
   * Get user-invocable skills.
   */
  getUserInvocable(): RegisteredSkill[] {
    return this.getAll().filter((skill) => skill.userInvocable);
  }

  /**
   * Get LLM-invocable skills (have whenToUse and not disabled).
   */
  getLLMInvocable(): RegisteredSkill[] {
    return this.getAll().filter(
      (skill) => skill.whenToUse && !skill.disableModelInvocation
    );
  }

  /**
   * Get built-in skills.
   */
  getBuiltin(): RegisteredSkill[] {
    return this.getAll().filter((skill) => this.builtinSkills.has(skill.name));
  }

  /**
   * Get custom (non-builtin) skills.
   */
  getCustom(): RegisteredSkill[] {
    return this.getAll().filter((skill) => !this.builtinSkills.has(skill.name));
  }

  /**
   * Get skill names.
   */
  getNames(): string[] {
    return Array.from(this.skills.keys());
  }

  /**
   * Clear all skills.
   */
  clear(): void {
    this.skills.clear();
    this.builtinSkills.clear();
  }

  /**
   * Get skill count.
   */
  get size(): number {
    return this.skills.size;
  }
}

// ============================================
// Skill Loading
// ============================================

/**
 * Load skills from a directory.
 * Original: cO0 (loadSkillsFromDirectory) in chunks.130.mjs
 *
 * Scans directory for SKILL.md files and parses them.
 */
export function loadSkillsFromDirectory(dirPath: string): SkillDiscoveryResult {
  const skills: SkillDefinition[] = [];
  const errors: Array<{ path: string; error: string }> = [];

  if (!existsSync(dirPath)) {
    return { skills, errors };
  }

  try {
    const entries = readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Check for SKILL.md in subdirectory
        const skillPath = join(fullPath, SKILL_CONSTANTS.SKILL_FILENAME);
        if (existsSync(skillPath)) {
          const result = loadSkillFile(skillPath);
          if ('error' in result) {
            errors.push({ path: skillPath, error: result.error });
          } else {
            skills.push(result);
          }
        }
      } else if (entry.name.endsWith(SKILL_CONSTANTS.SKILL_EXTENSION)) {
        // Direct .md file (for backward compatibility)
        const result = loadSkillFile(fullPath);
        if ('error' in result) {
          errors.push({ path: fullPath, error: result.error });
        } else {
          skills.push(result);
        }
      }
    }
  } catch (error) {
    errors.push({
      path: dirPath,
      error: `Failed to read directory: ${error instanceof Error ? error.message : String(error)}`,
    });
  }

  return { skills, errors };
}

/**
 * Load a single skill file.
 */
function loadSkillFile(filePath: string): SkillDefinition | { error: string } {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return parseSkillFile(filePath, content);
  } catch (error) {
    return {
      error: `Failed to read file: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Discover skills from multiple directories.
 */
export function discoverSkills(options?: SkillLoadOptions): SkillDiscoveryResult {
  const allSkills: SkillDefinition[] = [];
  const allErrors: Array<{ path: string; error: string }> = [];

  // Default directories
  const directories = options?.directories ?? [
    join(process.cwd(), SKILL_CONSTANTS.PROJECT_SKILLS_DIR),
    join(homedir(), '.claude', 'skills'),
  ];

  for (const dir of directories) {
    const result = loadSkillsFromDirectory(dir);
    allSkills.push(...result.skills);
    allErrors.push(...result.errors);
  }

  return { skills: allSkills, errors: allErrors };
}

// ============================================
// Skill Conversion
// ============================================

/**
 * Convert skill definition to registered skill.
 */
export function toRegisteredSkill(
  definition: SkillDefinition,
  options?: {
    isBuiltin?: boolean;
    isEnabled?: () => boolean | Promise<boolean>;
  }
): RegisteredSkill {
  return {
    ...definition,
    isBuiltin: options?.isBuiltin ?? false,
    isEnabled: options?.isEnabled ?? (() => true),
    getPromptForCommand: (args?: string) => {
      return injectArguments(definition.content, args);
    },
  };
}

// ============================================
// Singleton Instance
// ============================================

let registryInstance: SkillRegistry | null = null;

/**
 * Get singleton skill registry.
 */
export function getSkillRegistry(): SkillRegistry {
  if (!registryInstance) {
    registryInstance = new SkillRegistry();
  }
  return registryInstance;
}

/**
 * Reset skill registry (for testing).
 */
export function resetSkillRegistry(): void {
  if (registryInstance) {
    registryInstance.clear();
  }
  registryInstance = null;
}

/**
 * Initialize skills from discovery.
 */
export function initializeSkills(options?: SkillLoadOptions): SkillDiscoveryResult {
  const registry = getSkillRegistry();
  const result = discoverSkills(options);

  // Register discovered skills
  for (const skill of result.skills) {
    const registered = toRegisteredSkill(skill);
    registry.register(registered);
  }

  return result;
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出。
