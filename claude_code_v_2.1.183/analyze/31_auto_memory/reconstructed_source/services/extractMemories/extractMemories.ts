/**
 * Extracts durable memories from the current session transcript
 * and writes them to the auto-memory directory (~/.claude/projects/<path>/memory/).
 *
 * It runs once at the end of each complete query loop (when the model produces
 * a final response with no tool calls) via handleStopHooks in stopHooks.ts.
 *
 * Uses the forked agent pattern (runForkedAgent) — a perfect fork of the main
 * conversation that shares the parent's prompt cache.
 *
 * State is closure-scoped inside initExtractMemories() rather than module-level,
 * following the same pattern as confidenceRating.ts. Tests call
 * initExtractMemories() in beforeEach to get a fresh closure.
 *
 * ── v2.1.183 reconstruction ──────────────────────────────────────────────────
 * 2.1.183 regions covered: cli_inner_pretty.js:454872-455252
 *   - countModelVisibleMessagesSince  l2p   @454948
 *   - hasMemoryWritesSince            c2p   @454962
 *   - hasUserProseSince               u2p   @454989   [DELTA — new skip rung]
 *   - isSubstantialUserMessage        TQa   @454982   [DELTA]
 *   - countWords                      vQa   @454979   [DELTA]
 *   - denyAutoMemTool                 x4t   @455001
 *   - isReadOnlyRemoveItem (pwsh)     d2p   @455008   [DELTA — scoped delete]
 *   - isMemoryScopedRm (bash)         p2p   @455025   [DELTA — scoped delete]
 *   - isAutoMemPathMd                 k4t   @455056   [DELTA — .md && isAutoMemPathWritable(Lkt), exported as isAllowedAutoMemWritePath]
 *   - createAutoMemCanUseTool         zGn   @455059   [DELTA — toggle/pwsh/tiny]
 *   - getWrittenFilePath              CQa   @455096
 *   - extractWrittenPaths             f2p   @455105
 *   - initExtractMemories             m2p   @455118
 *   - runExtraction                   i     @455125
 *   - executeExtractMemoriesImpl      a     @455216
 *   - executeExtractMemories          A2p   @455243
 *   - drainPendingExtraction          g2p   @455246
 *   - MIN_PROSE_WORDS                 HQa=3 @455250   [DELTA]
 * 2.1.88 ancestor (shape + real names + comments):
 *   src/services/extractMemories/extractMemories.ts
 * scaffold: 31_auto_memory/README.md (per-turn extraction TL;DR §12);
 *   v2.1.156 extract_memories_runtime.md (full subagent + sandbox analysis)
 * cross-val (re-read in 183): skip-ladder gained a "no_prose" rung between the
 *   direct-write skip and the throttle (455136-455142); the canUseTool sandbox
 *   gained a /toggle-memory off short-circuit, a trustedNetworkDirectories check
 *   on Read/Grep/Glob (Cdt@574715), PowerShell support, and a tiny-mode Edit ban
 *   with scoped rm/Remove-Item allow; runForkedAgent gained skipCacheWrite:npt();
 *   the remote skip is now dd()!==null (not getIsRemoteMode); the trailing run is
 *   guarded by throttle<=1; extra memory_extract feature-result telemetry was added —
 *   logFeatureOk('memory_extract') (Le@455203 -> tengu_feature_ok) on success and
 *   logFeatureBad('memory_extract','agent_error') (Me@455207 -> tengu_feature_bad) on
 *   error (these are EVENTS, not counters). The prompt builders collapsed into one
 *   SQa(count, manifest, teamEnabled) whose 3rd arg = Nk()=isTeamMemoryEnabled and
 *   gates only the "scope guidance, " text (SQa does NOT read tengu_moth_copse) — see
 *   ./prompts.ts. denyAutoMemTool message strings copied verbatim from 455080-455093.
 */

import { feature } from 'bun:bundle'
import { basename } from 'path'
import type { CanUseToolFn } from '../../hooks/useCanUseTool.js'
import { ENTRYPOINT_NAME } from '../../memdir/memdir.js'
import {
  formatMemoryManifest,
  scanMemoryFiles,
} from '../../memdir/memoryScan.js'
import {
  getAutoMemPath,
  isAutoMemoryEnabled,
  isAutoMemPath, // SK @147718 — loose "inside memory dir" check (used by hasMemoryWritesSince)
  isAutoMemPathWritable, // Lkt @147721 — stricter: inside memory dir AND not in an excluded subdir (.git/hooks/node_modules/…) — used by the .md write carve-out
  isTinyMemoryEnabled, // DELTA v2.1.x: tiny-memory mode (aH @147673 -> tengu_billiard_aviary @455085/SQa@454889). NOTE: aH is isTinyMemoryEnabled, NOT isExtractModeActive (Nyn@147662, reads tengu_passport_quail).
} from '../../memdir/paths.js'
// DELTA v2.1.x: /toggle-memory off short-circuit (uU @3202 @455061). This is the
// same session toggle paths.ts's isAutoMemoryEnabled gates on (isMemoryToggledOff);
// imported from its SSOT in runtimeState rather than re-exported through paths.js.
import { isMemoryToggledOff } from '../../bootstrap/runtimeState.js'
import type { Tool } from '../../Tool.js'
import { BASH_TOOL_NAME } from '../../tools/BashTool/toolName.js'
import { FILE_EDIT_TOOL_NAME } from '../../tools/FileEditTool/constants.js'
import { FILE_READ_TOOL_NAME } from '../../tools/FileReadTool/prompt.js'
import { FILE_WRITE_TOOL_NAME } from '../../tools/FileWriteTool/prompt.js'
import { GLOB_TOOL_NAME } from '../../tools/GlobTool/prompt.js'
import { GREP_TOOL_NAME } from '../../tools/GrepTool/prompt.js'
// DELTA v2.1.x: PowerShell is now a first-class read-only shell alongside Bash (Xs @221424)
// (POWERSHELL_TOOL_NAME is exported from PowerShellTool/toolName.ts in the 88 ancestor,
//  same module as BASH_TOOL_NAME's BashTool/toolName.ts — not a `constants` module.)
import { POWERSHELL_TOOL_NAME } from '../../tools/PowerShellTool/toolName.js'
import { REPL_TOOL_NAME } from '../../tools/REPLTool/constants.js'
import type {
  AssistantMessage,
  Message,
  SystemLocalCommandMessage,
  SystemMessage,
} from '../../types/message.js'
import { createAbortController } from '../../utils/abortController.js'
import { count, uniq } from '../../utils/array.js'
import { logForDebugging } from '../../utils/debug.js'
import {
  createCacheSafeParams,
  runForkedAgent,
} from '../../utils/forkedAgent.js'
import type { REPLHookContext } from '../../utils/hooks/postSamplingHooks.js'
import {
  createMemorySavedMessage,
  createUserMessage,
} from '../../utils/messages.js'
// DELTA v2.1.x: read-tool path permission gate, shared with the main agent (Cdt @574715)
import { checkReadToolPermission } from '../../tools/checkReadToolPermission.js'
// DELTA v2.1.x: parse the scoped rm / Remove-Item delete forms allowed in the sandbox
import { parseBashCommand } from '../../utils/shellParser.js'
// DELTA v2.1.x: platform helper — Unix shell (rm) vs Windows shell (Remove-Item) (Su @221433)
import { isUnixShell } from '../../utils/platform.js'
// DELTA v2.1.x: remote-mode probe replaces getIsRemoteMode() (dd @50521)
import { getRemoteContext } from '../../bootstrap/state.js'
import { getFeatureValue_CACHED_MAY_BE_STALE } from '../analytics/growthbook.js'
// DELTA v2.1.x: feature-result telemetry for the memory_extract metric.
// NOTE: logFeatureOk/logFeatureBad are NOT counters — Le @44569 emits
// logEvent('tengu_feature_ok', {feature_name}) and Me @44572 emits
// logEvent('tengu_feature_bad', {feature_name, error_code}). Named per the
// established readable mapping, same as the goal/slash-command tree.
import { logEvent, logFeatureOk, logFeatureBad } from '../analytics/index.js'
import { sanitizeToolNameForAnalytics } from '../analytics/metadata.js'
// DELTA v2.1.x: skip prompt-cache write for forked extraction when gated (npt @454872)
import { shouldSkipForkCacheWrite } from '../../utils/forkedAgentCache.js'
// DELTA v2.1.x: prompt builders collapsed into one entry that branches on teamEnabled internally (SQa @454882)
import { buildExtractionPrompt } from './prompts.js'

/* eslint-disable @typescript-eslint/no-require-imports */
const teamMemPaths = feature('TEAMMEM')
  ? (require('../../memdir/teamMemPaths.js') as typeof import('../../memdir/teamMemPaths.js'))
  : null
/* eslint-enable @typescript-eslint/no-require-imports */

// In v2.1.183 the TEAMMEM enabled branch is inlined: isTeamMemoryEnabled() and
// isTeamMemPath() are called unconditionally (Nk @151098, Bme @151159) — the
// team metadata is always computed and `teamCount` is always attached to the
// memory_saved message. We keep the feature('TEAMMEM') guard for shape parity.
// feature('TEAMMEM') inlined-enabled in 183.

/**
 * Minimum number of whitespace-separated words a user message must contain to be
 * considered "substantial prose" worth triggering an extraction.
 * DELTA v2.1.x: new in 183 — gates the "no_prose" skip rung. @cli_inner_pretty.js:455250 (HQa = 3)
 */
const MIN_PROSE_WORDS = 3

// ============================================================================
// Helpers
// ============================================================================

// 2.1.183: isModelVisibleMessage = rgo @cli_inner_pretty.js:454945
/**
 * Returns true if a message is visible to the model (sent in API calls).
 * Excludes progress, system, and attachment messages.
 */
function isModelVisibleMessage(message: Message): boolean {
  return message.type === 'user' || message.type === 'assistant'
}

// 2.1.183: countModelVisibleMessagesSince = l2p @cli_inner_pretty.js:454948
function countModelVisibleMessagesSince(
  messages: Message[],
  sinceUuid: string | undefined,
): number {
  if (sinceUuid === null || sinceUuid === undefined) {
    return count(messages, isModelVisibleMessage)
  }

  let foundStart = false
  let n = 0
  for (const message of messages) {
    if (!foundStart) {
      if (message.uuid === sinceUuid) {
        foundStart = true
      }
      continue
    }
    if (isModelVisibleMessage(message)) {
      n++
    }
  }
  // If sinceUuid was not found (e.g., removed by context compaction),
  // fall back to counting all model-visible messages rather than returning 0
  // which would permanently disable extraction for the rest of the session.
  if (!foundStart) {
    return count(messages, isModelVisibleMessage)
  }
  return n
}

// 2.1.183: hasMemoryWritesSince = c2p @cli_inner_pretty.js:454962
/**
 * Returns true if any assistant message after the cursor UUID contains a
 * Write/Edit tool_use block targeting an auto-memory path.
 *
 * The main agent's prompt has full save instructions — when it writes
 * memories, the forked extraction is redundant. runExtraction skips the
 * agent and advances the cursor past this range, making the main agent
 * and the background agent mutually exclusive per turn.
 */
function hasMemoryWritesSince(
  messages: Message[],
  sinceUuid: string | undefined,
): boolean {
  let foundStart = sinceUuid === undefined
  for (const message of messages) {
    if (!foundStart) {
      if (message.uuid === sinceUuid) {
        foundStart = true
      }
      continue
    }
    if (message.type !== 'assistant') {
      continue
    }
    const content = (message as AssistantMessage).message.content
    if (!Array.isArray(content)) {
      continue
    }
    for (const block of content) {
      const filePath = getWrittenFilePath(block)
      // @454974 — note: uses isAutoMemPath (SK), NOT the .md-restricted k4t
      if (filePath !== undefined && isAutoMemPath(filePath)) {
        return true
      }
    }
  }
  return false
}

// 2.1.183: countWords = vQa @cli_inner_pretty.js:454979  [DELTA — new in 183]
/** Count whitespace-separated, non-empty tokens in a string. */
function countWords(text: string): number {
  return count(text.split(/\s+/), Boolean)
}

// 2.1.183: isSubstantialUserMessage = TQa @cli_inner_pretty.js:454982  [DELTA — new in 183]
/**
 * True when a user message carries at least MIN_PROSE_WORDS words of real prose.
 * Meta messages and non-text content (tool results, attachments) never qualify.
 */
function isSubstantialUserMessage(message: Message): boolean {
  if (message.type !== 'user' || (message as { isMeta?: boolean }).isMeta) {
    return false
  }
  const content = (message as { message: { content: unknown } }).message.content
  if (typeof content === 'string') {
    return countWords(content) >= MIN_PROSE_WORDS
  }
  if (!Array.isArray(content)) {
    return false
  }
  return content.some(
    block =>
      block.type === 'text' && countWords(block.text) >= MIN_PROSE_WORDS,
  )
}

// 2.1.183: hasUserProseSince = u2p @cli_inner_pretty.js:454989  [DELTA — new skip rung in 183]
/**
 * DELTA v2.1.x: gate the per-turn extraction on the user having actually said
 * something. Returns true if any user message after the cursor is substantial
 * prose. When the cursor UUID was dropped (compaction), it falls back to
 * scanning the whole transcript so extraction is not permanently wedged off.
 *
 * Rationale: a turn whose only "user" messages are tool results / one-word
 * acknowledgements ("ok", "yes") rarely yields a durable memory, so skipping
 * it before forking the agent saves the whole extraction round-trip.
 */
function hasUserProseSince(
  messages: Message[],
  sinceUuid: string | undefined,
): boolean {
  let foundStart = sinceUuid === undefined
  for (const message of messages) {
    if (!foundStart) {
      if (message.uuid === sinceUuid) {
        foundStart = true
      }
      continue
    }
    if (isSubstantialUserMessage(message)) {
      return true
    }
  }
  // cursor lost — fall back to "any substantial prose at all in history"
  if (!foundStart) {
    return messages.some(isSubstantialUserMessage)
  }
  return false
}

// ============================================================================
// Tool Permissions
// ============================================================================

// 2.1.183: denyAutoMemTool = x4t @cli_inner_pretty.js:455001
function denyAutoMemTool(tool: Tool, reason: string) {
  logForDebugging(`[autoMem] denied ${tool.name}: ${reason}`)
  logEvent('tengu_auto_mem_tool_denied', {
    tool_name: sanitizeToolNameForAnalytics(tool.name),
  })
  return {
    behavior: 'deny' as const,
    message: reason,
    decisionReason: { type: 'other' as const, reason },
  }
}

// 2.1.183: isAutoMemPathMd = k4t @cli_inner_pretty.js:455056  [DELTA — .md gate added in 183]
// Exported from the bundle's extractMemories module as `isAllowedAutoMemWritePath`
// (see KGn export map @454939). Same predicate autoDream calls `isMemoryMdPathSafe`.
/**
 * DELTA v2.1.x: Edit/Write/scoped-delete are now restricted to `*.md` files
 * inside the auto-memory directory (not any path). The mutual-exclusion scan
 * (hasMemoryWritesSince) still uses the looser isAutoMemPath (SK), but the
 * sandbox/written-path allow-list requires `.md` AND uses the STRICTER
 * isAutoMemPathWritable (Lkt @147721), which additionally rejects paths passing
 * through an excluded subdir (.git/hooks/node_modules/.claude/skills/…) — NOT
 * the loose isAutoMemPath (SK). @455056: `return e.endsWith(".md") && Lkt(e)`.
 */
export function isAutoMemPathMd(filePath: string): boolean {
  return filePath.endsWith('.md') && isAutoMemPathWritable(filePath)
}

// 2.1.183: isMemoryScopedRm = p2p @cli_inner_pretty.js:455025  [DELTA — new in 183]
/**
 * DELTA v2.1.x: in tiny-memory mode memories are immutable, so the model
 * deletes-and-recreates instead of editing. This whitelists a *single* bare
 * `rm` whose every operand is an absolute `*.md` path inside the memory dir,
 * with no redirects, env-vars, recursion flags, or glob characters.
 *
 * Parses with the shell parser (parseBashCommand) so we reason over real argv,
 * not a regex over the raw string.
 */
async function isMemoryScopedRm(command: string): Promise<boolean> {
  const parsed = await parseBashCommand(command)
  if (parsed.kind !== 'simple') return false
  if (parsed.commands.length !== 1) return false
  const cmd = parsed.commands[0]
  if (!cmd) return false
  if (cmd.argv[0] !== 'rm') return false
  if (cmd.redirects.length > 0) return false
  if (cmd.envVars.length > 0) return false

  let pathCount = 0
  let afterDoubleDash = false
  for (let i = 1; i < cmd.argv.length; i++) {
    const arg = cmd.argv[i]
    if (arg === undefined) continue
    if (!afterDoubleDash) {
      if (arg === '--') {
        afterDoubleDash = true
        continue
      }
      if (arg.startsWith('-')) {
        // reject any recursive flag (-r, -R, --recursive, -rf, …)
        if (arg === '--recursive' || /^-[a-zA-Z]*[rR]/.test(arg)) return false
        continue
      }
    }
    if (/[*?[]/.test(arg)) return false // no globbing
    if (!arg.startsWith('/') || !arg.endsWith('.md')) return false
    if (!isAutoMemPath(arg)) return false
    pathCount++
  }
  return pathCount > 0
}

// 2.1.183: isReadOnlyRemoveItem = d2p @cli_inner_pretty.js:455008  [DELTA — new in 183]
/**
 * DELTA v2.1.x: the Windows analog of isMemoryScopedRm — whitelists a PowerShell
 * `Remove-Item`/`ri`/`del`/`erase`/`rd`/`rmdir` whose every operand is a quoted
 * or bare `*.md` path inside the memory dir, with no shell metacharacters.
 * Operates on a regex tokenization of the raw command (no PowerShell AST parser).
 */
function isReadOnlyRemoveItem(command: string): boolean {
  const tokens = command.trim().match(/"[^"]*"|'[^']*'|\S+/g) ?? []
  if (tokens.length < 2) return false
  if (!/^(remove-item|ri|del|erase|rd|rm|rmdir)$/i.test(tokens[0])) return false

  let pathCount = 0
  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i]
    if (/^-(?:Literal)?Path$/i.test(token)) continue // -Path / -LiteralPath flag
    if (token.startsWith('-')) return false // any other switch is rejected
    const unquoted =
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'"))
        ? token.slice(1, -1)
        : token
    if (/[*?[\]$`(){}|;&<>"',]/.test(unquoted)) return false
    if (!unquoted.endsWith('.md')) return false
    if (!isAutoMemPath(unquoted)) return false
    pathCount++
  }
  return pathCount > 0
}

// 2.1.183: createAutoMemCanUseTool = zGn @cli_inner_pretty.js:455059
/**
 * Creates a canUseTool function that allows Read/Grep/Glob (subject to the
 * shared read-tool path permission), read-only Bash/PowerShell commands (plus,
 * in tiny mode, scoped `rm`/`Remove-Item` deletes), and Edit/Write only for
 * `*.md` paths within the auto-memory directory. Shared by extractMemories and
 * autoDream.
 *
 * DELTA v2.1.x vs the 88 ancestor:
 *  - Short-circuits to deny when memory is /toggle-memory'd off (@455061).
 *  - Read/Grep/Glob now run through checkReadToolPermission (Cdt) instead of an
 *    unconditional allow (@455063-455067).
 *  - PowerShell is a first-class read-only shell alongside Bash (@455068).
 *  - Read-only shells may additionally run scoped delete forms (@455074).
 *  - Edit (Fa) is denied outright in tiny-memory mode — memories are immutable,
 *    so the model deletes via shell and rewrites via Write (@455084-455088).
 *  - Edit/Write require an *.md path (isAutoMemPathMd), not any path (@455090).
 */
export function createAutoMemCanUseTool(memoryDir: string): CanUseToolFn {
  return async (tool: Tool, input: Record<string, unknown>, context) => {
    // DELTA v2.1.x: /toggle-memory off disables the whole sandbox (@455061)
    if (isMemoryToggledOff()) {
      return denyAutoMemTool(
        tool,
        'Memory is toggled off. Run /toggle-memory to re-enable automemory.',
      )
    }

    // Allow REPL — when REPL mode is enabled (ant-default), primitive tools
    // are hidden from the tool list so the forked agent calls REPL instead.
    // REPL's VM context re-invokes this canUseTool for each inner primitive
    // (toolWrappers.ts createToolWrapper), so the Read/Bash/Edit/Write checks
    // below still gate the actual file and shell operations. Giving the fork a
    // different tool list would break prompt cache sharing (tools are part of
    // the cache key — see CacheSafeParams in forkedAgent.ts).
    if (tool.name === REPL_TOOL_NAME) {
      return { behavior: 'allow' as const, updatedInput: input }
    }

    // Allow Read/Grep/Glob — all inherently read-only — subject to the shared
    // read-tool path permission (trustedNetworkDirectories etc.).
    // DELTA v2.1.x: @455063-455067 (was an unconditional allow in the 88 ancestor)
    if (
      tool.name === FILE_READ_TOOL_NAME ||
      tool.name === GREP_TOOL_NAME ||
      tool.name === GLOB_TOOL_NAME
    ) {
      const denial = checkReadToolPermission(
        tool,
        input,
        context.getAppState().toolPermissionContext,
      )
      if (denial) {
        return denyAutoMemTool(tool, denial.message)
      }
      return { behavior: 'allow' as const, updatedInput: input }
    }

    // Allow Bash / PowerShell only for commands that pass `isReadOnly`, or for
    // the scoped delete forms (rm / Remove-Item entirely within memoryDir).
    // `tool` IS the shell tool here — no static import needed.
    // DELTA v2.1.x: PowerShell branch + scoped-delete branch added (@455068-455081)
    if (tool.name === BASH_TOOL_NAME || tool.name === POWERSHELL_TOOL_NAME) {
      const parsed = tool.inputSchema.safeParse(input)
      if (parsed.success) {
        if (tool.isReadOnly(parsed.data)) {
          return { behavior: 'allow' as const, updatedInput: input }
        }
        const command = parsed.data.command
        if (typeof command === 'string') {
          const allowedDelete =
            tool.name === BASH_TOOL_NAME
              ? await isMemoryScopedRm(command)
              : isReadOnlyRemoveItem(command)
          if (allowedDelete) {
            return { behavior: 'allow' as const, updatedInput: input }
          }
        }
      }
      const isBash = tool.name === BASH_TOOL_NAME
      return denyAutoMemTool(
        tool,
        // VERBATIM @455080
        `Only read-only shell commands and ${
          isBash ? 'rm' : 'Remove-Item'
        } with all paths inside ${memoryDir} are permitted in this context (${
          isBash
            ? 'ls, find, grep, cat, stat, wc, head, tail, and similar'
            : 'Get-ChildItem, Get-Content, Select-Object -First/-Last, and similar'
        })`,
      )
    }

    if (
      (tool.name === FILE_EDIT_TOOL_NAME ||
        tool.name === FILE_WRITE_TOOL_NAME) &&
      'file_path' in input
    ) {
      // DELTA v2.1.x: Edit is denied entirely in tiny-memory mode (@455085: `t.name === Fa && aH()`)
      if (tool.name === FILE_EDIT_TOOL_NAME && isTinyMemoryEnabled()) {
        return denyAutoMemTool(
          tool,
          // VERBATIM @455087
          `${FILE_EDIT_TOOL_NAME} is not permitted in tiny memory mode — memories are immutable, so delete via ${
            isUnixShell() ? 'Bash rm' : 'PowerShell Remove-Item'
          } and rewrite via ${FILE_WRITE_TOOL_NAME}.`,
        )
      }
      const filePath = input.file_path
      // DELTA v2.1.x: now requires an *.md path (isAutoMemPathMd) (@455090)
      if (typeof filePath === 'string' && isAutoMemPathMd(filePath)) {
        return { behavior: 'allow' as const, updatedInput: input }
      }
    }

    // VERBATIM @455093 — final catch-all deny
    const readOnlyShell = isUnixShell() ? BASH_TOOL_NAME : POWERSHELL_TOOL_NAME
    return denyAutoMemTool(
      tool,
      `only ${FILE_READ_TOOL_NAME}, ${GREP_TOOL_NAME}, ${GLOB_TOOL_NAME}, read-only ${readOnlyShell}, and ${FILE_EDIT_TOOL_NAME}/${FILE_WRITE_TOOL_NAME} within ${memoryDir} are allowed`,
    )
  }
}

// ============================================================================
// Extract file paths from agent output
// ============================================================================

// 2.1.183: getWrittenFilePath = CQa @cli_inner_pretty.js:455096
/**
 * Extract file_path from a tool_use block's input, if present.
 * Returns undefined when the block is not an Edit/Write tool use or has no file_path.
 */
function getWrittenFilePath(block: {
  type: string
  name?: string
  input?: unknown
}): string | undefined {
  if (
    block.type !== 'tool_use' ||
    (block.name !== FILE_EDIT_TOOL_NAME && block.name !== FILE_WRITE_TOOL_NAME)
  ) {
    return undefined
  }
  const input = block.input
  if (typeof input === 'object' && input !== null && 'file_path' in input) {
    const fp = (input as { file_path: unknown }).file_path
    return typeof fp === 'string' ? fp : undefined
  }
  return undefined
}

// 2.1.183: extractWrittenPaths = f2p @cli_inner_pretty.js:455105
function extractWrittenPaths(agentMessages: Message[]): string[] {
  const paths: string[] = []
  for (const message of agentMessages) {
    if (message.type !== 'assistant') {
      continue
    }
    const content = (message as AssistantMessage).message.content
    if (!Array.isArray(content)) {
      continue
    }
    for (const block of content) {
      const filePath = getWrittenFilePath(block)
      // DELTA v2.1.x: only count *.md paths inside memoryDir (@455113 — was filePath !== undefined)
      if (filePath !== undefined && isAutoMemPathMd(filePath)) {
        paths.push(filePath)
      }
    }
  }
  return uniq(paths)
}

// ============================================================================
// Initialization & Closure-scoped State
// ============================================================================

type AppendSystemMessageFn = (
  msg: Exclude<SystemMessage, SystemLocalCommandMessage>,
) => void

/** The active extractor function, set by initExtractMemories(). */
// 2.1.183: extractor slot = IQa @cli_inner_pretty.js:455251 (assigned @455229)
let extractor:
  | ((
      context: REPLHookContext,
      appendSystemMessage?: AppendSystemMessageFn,
    ) => Promise<void>)
  | null = null

/** The active drain function, set by initExtractMemories(). No-op until init. */
// 2.1.183: drainer slot = xQa @cli_inner_pretty.js:455252 (assigned @455238)
let drainer: (timeoutMs?: number) => Promise<void> = async () => {}

// 2.1.183: initExtractMemories = m2p @cli_inner_pretty.js:455118
/**
 * Initialize the memory extraction system.
 * Creates a fresh closure that captures all mutable state (cursor position,
 * overlap guard, pending context). Call once at startup alongside
 * initConfidenceRating/initPromptCoaching, or per-test in beforeEach.
 */
export function initExtractMemories(): void {
  // --- Closure-scoped mutable state ---  (@455119-455124)

  /** Every promise handed out by the extractor that hasn't settled yet.
   *  Coalesced calls that stash-and-return add fast-resolving promises
   *  (harmless); the call that starts real work adds a promise covering the
   *  full trailing-run chain via runExtraction's recursive finally. */
  const inFlightExtractions = new Set<Promise<void>>() // = e

  /** UUID of the last message processed — cursor so each run only
   *  considers messages added since the previous extraction. */
  let lastMemoryMessageUuid: string | undefined // = t

  /** One-shot flag: once we log that the gate is disabled, don't repeat. */
  let hasLoggedGateFailure = false // = n

  /** True while runExtraction is executing — prevents overlapping runs. */
  let inProgress = false // = r

  /** Counts eligible turns since the last extraction run. Resets to 0 after each run. */
  let turnsSinceLastExtraction = 0 // = o

  /** When a call arrives during an in-progress run, we stash the context here
   *  and run one trailing extraction after the current one finishes. */
  let pendingContext: // = s
    | {
        context: REPLHookContext
        appendSystemMessage?: AppendSystemMessageFn
      }
    | undefined

  // --- Inner extraction logic ---

  // 2.1.183: runExtraction = i (inner) @cli_inner_pretty.js:455125
  async function runExtraction({
    context,
    appendSystemMessage,
    isTrailingRun,
  }: {
    context: REPLHookContext
    appendSystemMessage?: AppendSystemMessageFn
    isTrailingRun?: boolean
  }): Promise<void> {
    const { messages } = context
    const memoryDir = getAutoMemPath()
    const newMessageCount = countModelVisibleMessagesSince(
      messages,
      lastMemoryMessageUuid,
    )

    // Mutual exclusion: when the main agent wrote memories, skip the
    // forked agent and advance the cursor past this range so the next
    // extraction only considers messages after the main agent's write.
    // @455129-455135
    if (hasMemoryWritesSince(messages, lastMemoryMessageUuid)) {
      logForDebugging(
        '[extractMemories] skipping — conversation already wrote to memory files',
      )
      const lastMessage = messages.at(-1)
      if (lastMessage?.uuid) {
        lastMemoryMessageUuid = lastMessage.uuid
      }
      logEvent('tengu_extract_memories_skipped_direct_write', {
        message_count: newMessageCount,
      })
      return
    }

    // DELTA v2.1.x: skip rung — no substantial user prose since the cursor means
    // there is nothing worth extracting; advance the cursor and bail. @455136-455142
    if (!hasUserProseSince(messages, lastMemoryMessageUuid)) {
      logForDebugging(
        '[extractMemories] skipping — no user prose since last extraction',
      )
      const lastMessage = messages.at(-1)
      if (lastMessage?.uuid) {
        lastMemoryMessageUuid = lastMessage.uuid
      }
      logEvent('tengu_extract_memories_skipped_no_prose', {
        message_count: newMessageCount,
      })
      return
    }

    // feature('TEAMMEM') inlined-enabled in 183 — isTeamMemoryEnabled() is called
    // unconditionally @455143 (Nk).
    const teamMemoryEnabled = feature('TEAMMEM')
      ? teamMemPaths!.isTeamMemoryEnabled()
      : false

    // DELTA v2.1.x: in 183 the per-turn throttle is the ONLY feature-flag read in
    // runExtraction. The 88 ancestor's `skipIndex = tengu_moth_copse` read at the
    // call site is GONE — tengu_moth_copse is not read anywhere on this path in 183
    // (it survives only in loadMemoryPrompt@151860 and the suggestion path@465364).
    // The prompt builder's "scope guidance, " injection is gated on teamMemoryEnabled
    // (SQa's 3rd param `n` = Nk()), not on any feature flag. @455144 (A = ct('tengu_bramble_lintel', null) ?? 1)
    const throttleEveryNTurns =
      getFeatureValue_CACHED_MAY_BE_STALE('tengu_bramble_lintel', null) ?? 1

    const canUseTool = createAutoMemCanUseTool(memoryDir) // g = zGn(p) @455145
    const cacheSafeParams = createCacheSafeParams(context) // h = S8(l) @455146

    // Only run extraction every N eligible turns (tengu_bramble_lintel, default 1).
    // Trailing extractions (from stashed contexts) skip this check since they
    // process already-committed work that should not be throttled. @455147-455149
    if (!isTrailingRun) {
      turnsSinceLastExtraction++
      if (turnsSinceLastExtraction < throttleEveryNTurns) {
        return
      }
    }
    turnsSinceLastExtraction = 0

    inProgress = true
    const startTime = Date.now()
    try {
      logForDebugging(
        `[extractMemories] starting — ${newMessageCount} new messages, memoryDir=${memoryDir}`,
      )

      // Pre-inject the memory directory manifest so the agent doesn't spend
      // a turn on `ls`. Reuses findRelevantMemories' frontmatter scan.
      // Placed after the throttle gate so skipped turns don't pay the scan cost.
      // @455154
      const existingMemories = formatMemoryManifest(
        await scanMemoryFiles(memoryDir, createAbortController().signal),
      )

      // DELTA v2.1.x: a single builder (SQa) replaces the 88's two builders. It
      // branches internally on tiny-mode (aH) for tool guidance and takes
      // teamMemoryEnabled as its 3rd arg — which controls only the "scope guidance, "
      // fragment in the final taxonomy line (`n ? "scope guidance, " : ""`). It does
      // NOT read tengu_moth_copse. @455155 (b = SQa(f, _, m) where m = Nk())
      const userPrompt = buildExtractionPrompt(
        newMessageCount,
        existingMemories,
        teamMemoryEnabled,
      )

      const result = await runForkedAgent({
        promptMessages: [createUserMessage({ content: userPrompt })],
        cacheSafeParams,
        canUseTool,
        querySource: 'extract_memories',
        forkLabel: 'extract_memories',
        // The extractMemories subagent does not need to record to transcript.
        // Doing so can create race conditions with the main thread.
        skipTranscript: true,
        // Well-behaved extractions complete in 2-4 turns (read → write).
        // A hard cap prevents verification rabbit-holes from burning turns.
        maxTurns: 5,
        // DELTA v2.1.x: skip the prompt-cache write for the fork when gated
        // ($M && tengu_basalt_spur). @455164 (skipCacheWrite: npt())
        skipCacheWrite: shouldSkipForkCacheWrite(),
      })

      // Advance the cursor only after a successful run. If the agent errors
      // out (caught below), the cursor stays put so those messages are
      // reconsidered on the next extraction. @455166-455167
      const lastMessage = messages.at(-1)
      if (lastMessage?.uuid) {
        lastMemoryMessageUuid = lastMessage.uuid
      }

      const writtenPaths = extractWrittenPaths(result.messages)
      const turnCount = count(result.messages, m => m.type === 'assistant')

      const totalInput =
        result.totalUsage.input_tokens +
        result.totalUsage.cache_creation_input_tokens +
        result.totalUsage.cache_read_input_tokens
      const hitPct =
        totalInput > 0
          ? (
              (result.totalUsage.cache_read_input_tokens / totalInput) *
              100
            ).toFixed(1)
          : '0.0'
      logForDebugging(
        `[extractMemories] finished — ${writtenPaths.length} files written, cache: read=${result.totalUsage.cache_read_input_tokens} create=${result.totalUsage.cache_creation_input_tokens} input=${result.totalUsage.input_tokens} (${hitPct}% hit)`,
      )

      if (writtenPaths.length > 0) {
        logForDebugging(
          `[extractMemories] memories saved: ${writtenPaths.join(', ')}`,
        )
      } else {
        logForDebugging('[extractMemories] no memories saved this run')
      }

      // Index file updates are mechanical — the agent touches MEMORY.md to add
      // a topic link, but the user-visible "memory" is the topic file itself.
      // @455180-455181
      const memoryPaths = writtenPaths.filter(
        p => basename(p) !== ENTRYPOINT_NAME,
      )
      // feature('TEAMMEM') inlined-enabled in 183 — isTeamMemPath (Bme) called
      // unconditionally @455181.
      const teamCount = feature('TEAMMEM')
        ? count(memoryPaths, teamMemPaths!.isTeamMemPath)
        : 0

      // Log extraction event with usage from the forked agent  @455183-455194
      logEvent('tengu_extract_memories_extraction', {
        input_tokens: result.totalUsage.input_tokens,
        output_tokens: result.totalUsage.output_tokens,
        cache_read_input_tokens: result.totalUsage.cache_read_input_tokens,
        cache_creation_input_tokens:
          result.totalUsage.cache_creation_input_tokens,
        message_count: newMessageCount,
        turn_count: turnCount,
        files_written: writtenPaths.length,
        memories_saved: memoryPaths.length,
        team_memories_saved: teamCount,
        duration_ms: Date.now() - startTime,
      })

      logForDebugging(
        `[extractMemories] writtenPaths=${writtenPaths.length} memoryPaths=${memoryPaths.length} appendSystemMessage defined=${appendSystemMessage != null}`,
      )
      if (memoryPaths.length > 0) {
        const msg = createMemorySavedMessage(memoryPaths)
        // DELTA v2.1.x: teamCount is attached UNCONDITIONALLY in 183 — the bundle
        // is `(R.teamCount = P), c?.(R)` with no feature guard inline @455201.
        // (teamCount is 0 when TEAMMEM is disabled in shape, so this is faithful.)
        msg.teamCount = teamCount
        appendSystemMessage?.(msg)
      }

      // DELTA v2.1.x: success telemetry — logEvent('tengu_feature_ok',
      // {feature_name:'memory_extract'}). @455203 (Le)
      logFeatureOk('memory_extract')
    } catch (error) {
      // Extraction is best-effort — log but don't notify on error  @455204-455207
      logForDebugging(`[extractMemories] error: ${error}`)
      logEvent('tengu_extract_memories_error', {
        duration_ms: Date.now() - startTime,
      })
      // DELTA v2.1.x: error telemetry — logEvent('tengu_feature_bad',
      // {feature_name:'memory_extract', error_code:'agent_error'}). @455207 (Me)
      logFeatureBad('memory_extract', 'agent_error')
    } finally {
      inProgress = false

      // If a call arrived while we were running, run a trailing extraction
      // with the latest stashed context. The trailing run will compute its
      // newMessageCount relative to the cursor we just advanced — so it only
      // picks up messages added between the two calls, not the full history.
      // @455209-455213
      const trailing = pendingContext
      pendingContext = undefined
      // DELTA v2.1.x: trailing run only fires when the throttle is <= 1. With a
      // throttle > 1, the stashed context is dropped (the next real call will
      // re-stash if still in-progress). @455211 (`_ && A <= 1`)
      if (trailing && throttleEveryNTurns <= 1) {
        logForDebugging(
          '[extractMemories] running trailing extraction for stashed context',
        )
        await runExtraction({
          context: trailing.context,
          appendSystemMessage: trailing.appendSystemMessage,
          isTrailingRun: true,
        })
      }
    }
  }

  // --- Public entry point (captured by extractor) ---

  // 2.1.183: executeExtractMemoriesImpl = a (inner) @cli_inner_pretty.js:455216
  async function executeExtractMemoriesImpl(
    context: REPLHookContext,
    appendSystemMessage?: AppendSystemMessageFn,
  ): Promise<void> {
    // Only run for the main agent, not subagents  @455217
    if (context.toolUseContext.agentId) {
      return
    }

    // @455218
    if (!getFeatureValue_CACHED_MAY_BE_STALE('tengu_passport_quail', false)) {
      // DELTA v2.1.x: the 88 ancestor emitted tengu_extract_memories_gate_disabled
      // (one-shot, USER_TYPE==='ant') here. In 183 that telemetry is GONE — the
      // event string does not exist anywhere in the bundle, and the closure's
      // gate-failure flag (n = !1 @455121) is declared but never read. The gate
      // now just returns. (hasLoggedGateFailure kept only for closure-shape
      // parity with the bundle's dead `n` var.)
      void hasLoggedGateFailure
      return
    }

    // Check auto-memory is enabled  @455219 (Iu)
    if (!isAutoMemoryEnabled()) {
      return
    }

    // Skip in remote mode.
    // DELTA v2.1.x: remote probe is now getRemoteContext() !== null (dd @50521),
    // not getIsRemoteMode(). @455220
    if (getRemoteContext() !== null) {
      return
    }

    // If an extraction is already in progress, stash this context for a
    // trailing run (overwrites any previously stashed context — only the
    // latest matters since it has the most messages). @455221-455226
    if (inProgress) {
      logForDebugging(
        '[extractMemories] extraction in progress — stashing for trailing run',
      )
      logEvent('tengu_extract_memories_coalesced', {})
      pendingContext = { context, appendSystemMessage }
      return
    }

    await runExtraction({ context, appendSystemMessage })
  }

  // 2.1.183: extractor assignment @cli_inner_pretty.js:455229
  extractor = async (context, appendSystemMessage) => {
    const p = executeExtractMemoriesImpl(context, appendSystemMessage)
    inFlightExtractions.add(p)
    try {
      await p
    } finally {
      inFlightExtractions.delete(p)
    }
  }

  // 2.1.183: drainer assignment @cli_inner_pretty.js:455238
  drainer = async (timeoutMs = 60_000) => {
    if (inFlightExtractions.size === 0) return
    await Promise.race([
      Promise.all(inFlightExtractions).catch(() => {}),
      // eslint-disable-next-line no-restricted-syntax -- sleep() has no .unref(); timer must not block exit
      new Promise<void>(r => setTimeout(r, timeoutMs).unref()),
    ])
  }
}

// ============================================================================
// Public API
// ============================================================================

// 2.1.183: executeExtractMemories = A2p @cli_inner_pretty.js:455243
/**
 * Run memory extraction at the end of a query loop.
 * Called fire-and-forget from handleStopHooks, alongside prompt suggestion/coaching.
 * No-ops until initExtractMemories() has been called.
 */
export async function executeExtractMemories(
  context: REPLHookContext,
  appendSystemMessage?: AppendSystemMessageFn,
): Promise<void> {
  await extractor?.(context, appendSystemMessage)
}

// 2.1.183: drainPendingExtraction = g2p @cli_inner_pretty.js:455246
/**
 * Awaits all in-flight extractions (including trailing stashed runs) with a
 * soft timeout. Called by print.ts after the response is flushed but before
 * gracefulShutdownSync, so the forked agent completes before the 5s shutdown
 * failsafe kills it. No-op until initExtractMemories() has been called.
 */
export async function drainPendingExtraction(
  timeoutMs?: number,
): Promise<void> {
  await drainer(timeoutMs)
}
