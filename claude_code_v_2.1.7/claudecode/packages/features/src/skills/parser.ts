/**
 * @claudecode/features - Skill Parser
 *
 * Parsing utilities for SKILL.md files.
 * Reconstructed from chunks.16.mjs, chunks.130.mjs
 */

import type { SkillFrontmatter, SkillDefinition } from './types.js';
import { SKILL_CONSTANTS } from './types.js';

// ============================================
// Frontmatter Parsing
// ============================================

/**
 * Parse YAML frontmatter from markdown content.
 * Original: NV (parseFrontmatter) in chunks.16.mjs:892-919
 *
 * Format:
 * ---
 * key: value
 * key2: value2
 * ---
 * content
 */
export function parseFrontmatter(content: string): {
  frontmatter: SkillFrontmatter;
  content: string;
} {
  // NOTE: Intentionally minimal parser to match source NV.
  // - Only supports single-line `key: value` pairs.
  // - Does NOT support nested YAML / lists / multiline blocks.
  // - Values are kept as strings (boolean coercion happens later).
  const pattern = /^---\s*\n([\s\S]*?)---\s*\n?/;
  const match = content.match(pattern);

  if (!match) return { frontmatter: {}, content };

  const frontmatterBlock = match[1] || '';
  const markdownContent = content.slice(match[0].length);
  const frontmatter: SkillFrontmatter = {};

  const lines = frontmatterBlock.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex <= 0) continue;
    const key = line.slice(0, colonIndex).trim();
    const rawValue = line.slice(colonIndex + 1).trim();
    if (!key) continue;
    // Strip surrounding quotes if present.
    const cleanValue = rawValue.replace(/^["']|["']$/g, '');
    (frontmatter as any)[key] = cleanValue;
  }

  return { frontmatter, content: markdownContent };
}

/**
 * Extract first heading from markdown content.
 * Original: Wx (extractFirstHeading) in chunks.130.mjs
 *
 * Used as fallback description if not specified in frontmatter.
 */
export function extractFirstHeading(content: string): string | null {
  // Match # Heading or ## Heading
  const match = content.match(/^#+\s+(.+?)$/m);
  const captured = match?.[1];
  return captured ? captured.trim() : null;
}

/**
 * Normalize frontmatter keys to camelCase.
 */
function normalizeFrontmatter(frontmatter: SkillFrontmatter): {
  name?: string;
  description?: string;
  version?: string;
  whenToUse?: string;
  argumentHint?: string;
  allowedTools?: string[];
  model?: string;
  disableModelInvocation: boolean;
  userInvocable: boolean;
} {
  const parseBoolean = (v: unknown, defaultValue: boolean): boolean => {
    if (v === undefined || v === null) return defaultValue;
    if (typeof v === 'boolean') return v;
    if (typeof v === 'string') {
      const t = v.trim().toLowerCase();
      if (t === 'true') return true;
      if (t === 'false') return false;
    }
    return defaultValue;
  };

  return {
    name: frontmatter.name,
    description: frontmatter.description,
    version: frontmatter.version,
    whenToUse: frontmatter.when_to_use ?? frontmatter['when-to-use'],
    argumentHint: frontmatter.argument_hint ?? frontmatter['argument-hint'],
    allowedTools: normalizeAllowedTools(frontmatter.allowed_tools ?? frontmatter['allowed-tools']),
    model: frontmatter.model,
    // Source alignment: `disable-model-invocation` controls LLM/tool eligibility (Nc filter).
    disableModelInvocation: parseBoolean(
      (frontmatter as any)['disable-model-invocation'] ?? (frontmatter as any).disableModelInvocation,
      false
    ),
    // Source alignment: `user-invocable` blocks direct `/command` if false.
    userInvocable: parseBoolean(
      (frontmatter as any)['user-invocable'] ?? (frontmatter as any).userInvocable,
      true
    ),
  };
}

/**
 * Normalize allowed tools to array.
 */
function normalizeAllowedTools(tools: string | string[] | undefined): string[] | undefined {
  if (!tools) return undefined;
  if (Array.isArray(tools)) return tools;
  if (tools === '*') return undefined; // All tools
  const trimmed = tools.trim();
  // Inline JSON array (commonly used in frontmatter examples).
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
        return parsed;
      }
    } catch {
      // fall through
    }
  }
  // Allow comma/space separated expressions while preserving parentheses.
  return splitAllowedToolsExpression(trimmed);
}

/**
 * Split an allowed-tools expression into tokens.
 *
 * Source alignment goal:
 * - Matches Uc/RS style parsing: split by commas/spaces **outside** parentheses.
 * - Keep parentheses content intact (e.g. `Bash(npm i)` stays one token).
 */
function splitAllowedToolsExpression(expr: string): string[] {
  const result: string[] = [];
  let current = '';
  let depth = 0;

  const push = () => {
    const t = current.trim();
    if (t) result.push(t);
    current = '';
  };

  for (const ch of expr) {
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
  return result;
}

// ============================================
// Skill Parsing
// ============================================

/**
 * Parse SKILL.md file content into skill definition.
 * Original: Part of cO0 (loadSkillsFromDirectory) in chunks.130.mjs
 */
export function parseSkillFile(
  filePath: string,
  fileContent: string
): SkillDefinition | { error: string } {
  try {
    const { frontmatter, content } = parseFrontmatter(fileContent);
    const normalized = normalizeFrontmatter(frontmatter);

    // Determine name (from frontmatter or directory name)
    const name = normalized.name ?? extractNameFromPath(filePath);
    if (!name) {
      return { error: 'Skill name could not be determined' };
    }

    // Determine description (from frontmatter or first heading)
    const description =
      normalized.description ??
      extractFirstHeading(content) ??
      'No description';

    return {
      name,
      description,
      version: normalized.version,
      filePath,
      content,
      whenToUse: normalized.whenToUse,
      argumentHint: normalized.argumentHint,
      // Source alignment: user invocability is independent from disableModelInvocation.
      userInvocable: normalized.userInvocable,
      allowedTools: normalized.allowedTools,
      model: normalized.model,
      disableModelInvocation: normalized.disableModelInvocation,
    };
  } catch (error) {
    return {
      error: `Failed to parse skill file: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Extract skill name from file path.
 * E.g., /path/to/my-skill/SKILL.md -> my-skill
 */
function extractNameFromPath(filePath: string): string | null {
  const parts = filePath.split(/[/\\]/);
  const fileName = parts.pop();

  // If it's SKILL.md, use parent directory name
  if (fileName?.toLowerCase() === SKILL_CONSTANTS.SKILL_FILENAME.toLowerCase()) {
    return parts.pop() ?? null;
  }

  // Otherwise use file name without extension
  if (fileName) {
    return fileName.replace(/\.md$/i, '');
  }

  return null;
}

// ============================================
// Argument Injection
// ============================================

/**
 * Inject arguments into skill content.
 * Replaces $ARGUMENTS placeholder with actual arguments.
 */
export function injectArguments(content: string, args?: string): string {
  if (!args) return content;

  // Replace all placeholders, otherwise append args block.
  if (content.includes(SKILL_CONSTANTS.ARGUMENTS_PLACEHOLDER)) {
    return content.replace(/\$ARGUMENTS/g, args);
  }
  return `${content}\n\nARGUMENTS: ${args}`;
}

/**
 * Check if content has arguments placeholder.
 */
export function hasArgumentsPlaceholder(content: string): boolean {
  return content.includes(SKILL_CONSTANTS.ARGUMENTS_PLACEHOLDER);
}

/**
 * Build the final prompt text for a skill/command.
 *
 * Source alignment:
 * - Skill mode (SKILL.md) injects a base directory header.
 * - Arguments are injected using `$ARGUMENTS` (replaceAll) or appended as `ARGUMENTS: ...`.
 *
 * Mirrors nfA.getPromptForCommand() in `source/chunks.130.mjs:1692`.
 */
export function buildSkillPromptText(options: {
  rawContent: string;
  baseDir?: string;
  args?: string;
  isSkillMode: boolean;
}): string {
  const { rawContent, baseDir, args, isSkillMode } = options;
  let text = rawContent;

  if (isSkillMode && baseDir) {
    text = `Base directory for this skill: ${baseDir}\n\n${rawContent}`;
  }

  return injectArguments(text, args);
}

// ============================================
// Export
// ============================================

// NOTE: 函数已在声明处导出；移除重复聚合导出。
