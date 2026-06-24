// =============================================================================
// Bundled-skill REGISTRAR + REGISTRY type (Claude Code v2.1.183)
// =============================================================================
// v2.1.183 regions covered:
//   - registerBundledSkill = ap @546973-547022  (emits the Command{type:'prompt',source:'bundled'})
//   - getBundledSkills      = Lwo @547023-547026 (returns a copy; [] when bundled skills disabled)
//   - areBundledSkillsDisabled = oV @392809-392811
//   - getBundledSkillExtractDir = txl @547027-547029
//   - extractBundledSkillFiles  = scf @547030-547041
//   - writeSkillFiles           = icf @547042-547057
//   - safeWriteFile             = ccf @547058-547065
//   - resolveSkillFilePath      = ucf @547066-547071
//   - prependBaseDir            = dcf @547072-547078
//   - defineLazyOverride (fn-valued desc/hint/whenToUse) = Gwe @193293-193296
//   - module-init thunk OH @547080-547088 (sets registry array exl=[], O_NOFOLLOW/flag consts)
//   - getBundledSkillsRoot = x6n @575179-575195 (vB()/bundled-skills/<version>/<nonce>)
// v2.1.88 ancestor / convention path:
//   src/skills/bundledSkills.ts  (registerBundledSkill, BundledSkillDefinition,
//   getBundledSkills, extractBundledSkillFiles, writeSkillFiles, resolveSkillFilePath,
//   prependBaseDir, safeWriteFile). Ported forward 1:1; new 2.1.183 fields added.
// 2.1.156->2.1.183 delta (registrar): the emitted Command gains `menuDescription`
//   (from definition.menuDescription) and `getArgumentCompletions`; `progressMessage`
//   becomes configurable (definition.progressMessage ?? 'running') instead of the
//   hardcoded 'running' in 156's `bA`. All other emitted fields are byte-identical
//   to 2.1.156 `bA` @524187. (156 region: bA @524187, registry Ji4, root o$q.)
// Cross-validation: ap()@546973 emitted-Command field set re-read against the bundle;
//   helper bodies (icf/ucf/dcf) match the v2.1.88 ancestor exactly; only the registry
//   array name and a few added fields differ. menuDescription confirmed present on all
//   three skills (loop@649254, simplify@647981, batch@637831).
// =============================================================================

import type { ContentBlockParam } from '@anthropic-ai/sdk/resources/index.mjs'
import { constants as fsConstants } from 'fs'
import { mkdir, open } from 'fs/promises'
import { dirname, isAbsolute, join, normalize, sep as pathSep } from 'path'
import type { ToolUseContext } from '../Tool.js'
import type { Command } from '../types/command.js'
import { logForDebugging } from '../utils/debug.js'
import {
  getBundledSkillsRoot, // 2.1.183: x6n @575179
} from '../utils/permissions/filesystem.js'
import { areBundledSkillsDisabled } from '../utils/settings/bundledSkills.js' // 2.1.183: oV @392809
import { logEvent } from '../services/statsig.js' // Le("skill_bundled_extract")
import { logError } from '../services/featureFlagTelemetry.js' // Me(...) on extract failure
import type { HooksSettings } from '../utils/settings/types.js'

/**
 * Definition for a bundled skill that ships with the CLI.
 * These are registered programmatically at startup (see ./bundled/index.ts).
 *
 * 2.1.183 superset of the v2.1.88 BundledSkillDefinition. Fields that accept a
 * function ({@link description}, {@link argumentHint}, {@link whenToUse}) are
 * installed as lazy getters on the emitted Command (see defineLazyOverride); the
 * eager copy on the Command is left "" / undefined so the registry array can be
 * scanned cheaply without forcing evaluation.
 */
export type BundledSkillDefinition = {
  name: string
  /** Plain string, or a lazily-resolved getter (installed via defineLazyOverride). */
  description: string | (() => string)
  /** 2.1.183 NEW: short one-line label for the command menu (eager, never a getter). */
  menuDescription?: string
  aliases?: string[]
  subcommands?: Command[]
  /** Plain string, or a lazily-resolved getter. */
  whenToUse?: string | (() => string)
  /** Plain string, or a lazily-resolved getter. */
  argumentHint?: string | (() => string)
  allowedTools?: string[]
  disallowedTools?: string[]
  model?: string
  disableModelInvocation?: boolean
  userInvocable?: boolean
  isEnabled?: () => boolean
  hooks?: HooksSettings
  context?: 'inline' | 'fork'
  agent?: string
  /** 2.1.183: spinner label shown while the skill prompt is being expanded. */
  progressMessage?: string
  getEffort?: (args: string) => string | undefined
  /** 2.1.183 NEW: argument-completion provider for the command palette. */
  getArgumentCompletions?: (args: string) => Promise<string[]> | string[]
  /**
   * Additional reference files to extract to disk on first invocation.
   * Keys are relative paths (forward slashes, no `..`), values are content.
   * When set, the skill prompt is prefixed with a "Base directory for this
   * skill: <dir>" line so the model can Read/Grep these files on demand —
   * same contract as disk-based skills.
   */
  files?: Record<string, string>
  getPromptForCommand: (
    args: string,
    context: ToolUseContext,
  ) => Promise<ContentBlockParam[]>
}

// 2.1.183: bundled-skill registry array = exl, initialized to [] in module-init OH @547085
// Internal registry for bundled skills.
const bundledSkills: Command[] = []

// 2.1.183: registerBundledSkill = ap @546973
/**
 * Register a bundled skill that will be available to the model.
 * Call this at module initialization or in an init function (./bundled/index.ts).
 *
 * Bundled skills are compiled into the CLI binary and available to all users.
 */
export function registerBundledSkill(definition: BundledSkillDefinition): void {
  const { files } = definition

  let skillRoot: string | undefined
  let getPromptForCommand = definition.getPromptForCommand

  // @546977: if the skill ships reference files, wrap getPromptForCommand to
  // extract-once (memoized promise) and prepend the base-directory line.
  if (files && Object.keys(files).length > 0) {
    skillRoot = getBundledSkillExtractDir(definition.name)
    let extractionPromise: Promise<string | null> | undefined
    const inner = definition.getPromptForCommand
    getPromptForCommand = async (args, ctx) => {
      extractionPromise ??= extractBundledSkillFiles(definition.name, files)
      const extractedDir = await extractionPromise
      const blocks = await inner(args, ctx)
      if (extractedDir === null) return blocks
      return prependBaseDir(blocks, extractedDir)
    }
  }

  // @546989: emitted Command. Function-valued description/argumentHint/whenToUse
  // are reduced to "" / undefined here, then re-installed as lazy getters below.
  const command: Command = {
    type: 'prompt',
    name: definition.name,
    description:
      typeof definition.description === 'function' ? '' : definition.description,
    menuDescription: definition.menuDescription, // 2.1.183 NEW
    aliases: definition.aliases,
    subcommands: definition.subcommands,
    hasUserSpecifiedDescription: true,
    allowedTools: definition.allowedTools ?? [],
    disallowedTools: definition.disallowedTools ?? [],
    argumentHint:
      typeof definition.argumentHint === 'function'
        ? undefined
        : definition.argumentHint,
    whenToUse:
      typeof definition.whenToUse === 'function'
        ? undefined
        : definition.whenToUse,
    model: definition.model,
    disableModelInvocation: definition.disableModelInvocation ?? false,
    userInvocable: definition.userInvocable ?? true,
    contentLength: 0, // Not applicable for bundled skills
    source: 'bundled',
    loadedFrom: 'bundled',
    hooks: definition.hooks,
    skillRoot,
    context: definition.context,
    agent: definition.agent,
    isEnabled: definition.isEnabled,
    isHidden: !(definition.userInvocable ?? true),
    progressMessage: definition.progressMessage ?? 'running', // 2.1.183: now configurable
    getPromptForCommand,
    getEffort: definition.getEffort,
    getArgumentCompletions: definition.getArgumentCompletions, // 2.1.183 NEW
  }

  // @547018: install lazy getters for any function-valued definition fields, so
  // the menu can scan the registry cheaply and resolve text only on demand.
  defineLazyOverride(command, 'description', definition.description)
  defineLazyOverride(command, 'argumentHint', definition.argumentHint)
  defineLazyOverride(command, 'whenToUse', definition.whenToUse)

  bundledSkills.push(command)
}

// 2.1.183: getBundledSkills = Lwo @547023
/**
 * Get all registered bundled skills. Returns a copy to prevent external mutation.
 * Yields [] when bundled skills are disabled (CLAUDE_CODE_DISABLE_BUNDLED_SKILLS
 * or settings.disableBundledSkills).
 */
export function getBundledSkills(): Command[] {
  if (areBundledSkillsDisabled()) return []
  return [...bundledSkills]
}

// 2.1.183: defineLazyOverride = Gwe @193293
/**
 * If `value` is a function, install it as a lazy, enumerable, configurable getter
 * on `target[key]`. Non-function values are left as-is (already set eagerly above).
 */
function defineLazyOverride(
  target: object,
  key: string,
  value: unknown,
): void {
  if (typeof value !== 'function') return
  Object.defineProperty(target, key, {
    get: value as () => unknown,
    enumerable: true,
    configurable: true,
  })
}

// 2.1.183: getBundledSkillExtractDir = txl @547027
/**
 * Deterministic extraction directory for a bundled skill's reference files:
 * <bundledSkillsRoot>/<skillName>. The per-process nonce lives in the root.
 */
export function getBundledSkillExtractDir(skillName: string): string {
  return join(getBundledSkillsRoot(), skillName)
}

// 2.1.183: extractBundledSkillFiles = scf @547030
/**
 * Extract a bundled skill's reference files to disk so the model can Read/Grep
 * them on demand. Called lazily on first skill invocation.
 *
 * Returns the directory written to, or null if write failed (the skill keeps
 * working, just without the base-directory prefix).
 */
async function extractBundledSkillFiles(
  skillName: string,
  files: Record<string, string>,
): Promise<string | null> {
  const dir = getBundledSkillExtractDir(skillName)
  try {
    await writeSkillFiles(dir, files)
    logEvent('skill_bundled_extract') // Le("skill_bundled_extract")
    return dir
  } catch (e) {
    logForDebugging(
      `Failed to extract bundled skill '${skillName}' to ${dir}: ${e instanceof Error ? e.message : String(e)}`,
    )
    logError('skill_bundled_extract', 'skill_bundled_extract_write_failed') // Me(...)
    return null
  }
}

// 2.1.183: writeSkillFiles = icf @547042
async function writeSkillFiles(
  dir: string,
  files: Record<string, string>,
): Promise<void> {
  // Group by parent dir so we mkdir each subtree once, then write.
  const byParent = new Map<string, [string, string][]>()
  for (const [relPath, content] of Object.entries(files)) {
    const target = resolveSkillFilePath(dir, relPath)
    const parent = dirname(target)
    const entry: [string, string] = [target, content]
    const group = byParent.get(parent)
    if (group) group.push(entry)
    else byParent.set(parent, [entry])
  }
  await Promise.all(
    [...byParent].map(async ([parent, entries]) => {
      await mkdir(parent, { recursive: true, mode: 0o700 })
      await Promise.all(entries.map(([p, c]) => safeWriteFile(p, c)))
    }),
  )
}

// The per-process nonce in getBundledSkillsRoot() is the primary defense against
// pre-created symlinks/dirs. Explicit 0o700/0o600 modes keep the nonce subtree
// owner-only even on umask=0. O_NOFOLLOW|O_EXCL is belt-and-suspenders.
// 2.1.183: acf @547086 (O_NOFOLLOW ?? 0), lcf @547087 (O_WRONLY|O_CREAT|O_EXCL|acf)
const O_NOFOLLOW = fsConstants.O_NOFOLLOW ?? 0
const SAFE_WRITE_FLAGS =
  process.platform === 'win32'
    ? 'wx'
    : fsConstants.O_WRONLY |
      fsConstants.O_CREAT |
      fsConstants.O_EXCL |
      O_NOFOLLOW

// 2.1.183: safeWriteFile = ccf @547058 (open(p, lcf, 384) then writeFile/close)
async function safeWriteFile(p: string, content: string): Promise<void> {
  const fh = await open(p, SAFE_WRITE_FLAGS, 0o600)
  try {
    await fh.writeFile(content, 'utf8')
  } finally {
    await fh.close()
  }
}

// 2.1.183: resolveSkillFilePath = ucf @547066
/** Normalize and validate a skill-relative path; throws on traversal. */
function resolveSkillFilePath(baseDir: string, relPath: string): string {
  const normalized = normalize(relPath)
  if (
    isAbsolute(normalized) ||
    normalized.split(pathSep).includes('..') ||
    normalized.split('/').includes('..')
  ) {
    throw new Error(`bundled skill file path escapes skill dir: ${relPath}`)
  }
  return join(baseDir, normalized)
}

// 2.1.183: prependBaseDir = dcf @547072
/**
 * Prefix the skill prompt with a "Base directory for this skill: <dir>" line so
 * the model knows where the extracted reference files live. Merges into the first
 * text block if present, otherwise prepends a new text block.
 */
function prependBaseDir(
  blocks: ContentBlockParam[],
  baseDir: string,
): ContentBlockParam[] {
  // Verbatim sentinel from dcf @547073 — preserved exactly (trailing blank line).
  const prefix = `Base directory for this skill: ${baseDir}\n\n`
  if (blocks.length > 0 && blocks[0]!.type === 'text') {
    return [
      { type: 'text', text: prefix + blocks[0]!.text },
      ...blocks.slice(1),
    ]
  }
  return [{ type: 'text', text: prefix }, ...blocks]
}
