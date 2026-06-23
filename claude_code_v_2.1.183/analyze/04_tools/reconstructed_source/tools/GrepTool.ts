/**
 * GrepTool — content search built on ripgrep ("Grep", user-facing "Search"),
 * read-only. Reconstructed at contract level from the v2.1.183 obfuscated tool
 * object, with a faithfully reconstructed ripgrep-arg-build core.
 *
 * 2.1.183 regions covered (PRIMARY: cli_inner_pretty.js):
 *   - name const   `Uc = "Grep"`                                  @221419
 *   - description/prompt builder `m5r(model)` (compact + full)    @221399-221418
 *   - input schema `Lbp` (15 fields incl. NEW `-o`)               @370676-370723
 *   - VCS exclude  `Dbp` (.git/.svn/.hg/.bzr/.jj/.sl)             @370724
 *   - output schema `Mbp`                                         @370727-370738
 *   - default head limit `Pbp = 250`                              @370655
 *   - paginator `sio(items, limit, offset)`                       @370640-370646
 *   - limit-info fmt `iio(appliedLimit, appliedOffset)`           @370647-370653
 *   - tool object  `OR = pi({...})`                               @370736-370920
 *   - ripgrep exec `Zie(args, cwd, signal)`                       @211151
 * 2.1.88 convention mirror: src/tools/GrepTool/GrepTool.ts (+ prompt.ts)
 *   — near-identical; 183 ADDS the `-o` (only-matching) field, `count` mode's
 *   `-H` flag, the Windows drive-letter colon-skip in content de-prefix, the
 *   workspace-deny-glob pass, and the model-branched prompt.
 * 2.1.156 scaffold: claude_code_v_2.1.156/analyze/04_tools/README.md
 * Cross-validation: re-read schema (incl. `-o`/`head_limit`/`offset` describes),
 *   the null-byte + ENOENT validateInput strings, and the full arg-build loop
 *   @370880-370916 in the 183 bundle — all match.
 */

import { z } from 'zod/v4'
import type { ValidationResult } from '../Tool'
import { buildTool, type ToolDef } from '../Tool'
import { getCwd } from '../../utils/cwd' // 2.1.183: getCwd = Pt
import { isENOENT } from '../../utils/errors' // 2.1.183: isENOENT = Pn
import {
  FILE_NOT_FOUND_CWD_NOTE, // 2.1.183: bN
  findSimilarFile, // 2.1.183: findSimilarFile = uoe @371122
} from '../../utils/file'
import { getFsImplementation } from '../../utils/fsOperations' // 2.1.183: Ut
import { lazySchema } from '../../utils/lazySchema' // we(...)
import { resolveToCwd, toRelativePath } from '../../utils/path' // 2.1.183: resolveToCwd = Ds (canonical), toRelativePath = Cze
import {
  checkReadPermissionForTool, // 2.1.183: _te
  getFileReadIgnorePatterns, // 2.1.183: project ignore set (Jlt input)
  normalizeWorkspaceDenyGlobs, // 2.1.183: F4e(U4e(ctx), Pt())
} from '../../utils/permissions/filesystem'
import { getToolPermissionContext } from '../../utils/permissions/context' // 2.1.183: Br(ctx)
import type { PermissionDecision } from '../../utils/permissions/PermissionResult'
import { matchWildcardPattern } from '../../utils/permissions/shellRuleMatching' // 2.1.183: t8
import { getProjectIgnoreGlobs } from '../../utils/plugins/orphanedPluginFilter' // 2.1.183: Jlt (def @370433, used @370915)
import { ripGrep } from '../../utils/ripgrep' // 2.1.183: Zie @211151
import { plural } from '../../utils/stringUtils' // 2.1.183: vn
import { coercedBoolean } from '../../utils/zodCoercion' // 2.1.183: n0 @292819 — canonical coerced-boolean helper
import { coerceNumber } from '../../utils/coerceNumber' // 2.1.183: GB @292825 — canonical numeric-coercion helper
import {
  getActivityDescriptionSummary, // helper: oio @370747
  renderToolResultMessage, // helper: rRa
  renderToolUseErrorMessage, // helper: nRa
  renderToolUseMessage, // helper: tRa
} from './UI'

// 2.1.183: GREP_TOOL_NAME = Uc @cli_inner_pretty.js:221419
export const GREP_TOOL_NAME = 'Grep'
// helper: ns @145275 — BASH_TOOL_NAME (interpolated into both prompt branches)
declare const BASH_TOOL_NAME: string
// helper: vs @ — AGENT_TOOL_NAME (interpolated into the full-prompt branch)
declare const AGENT_TOOL_NAME: string
// helper: Dg @ — lean/compact-prompt predicate
declare function isCompactPrompt(model: string | undefined): boolean

/**
 * Model-branched description/prompt builder. The compact/lean cohort
 * (`Dg(model)`) gets the terse ripgrep blurb; otherwise the full "powerful
 * search tool" usage block. Both are quoted verbatim from the 183 bundle and
 * match assets/tools/Grep.md "--- branch 1/2 ---".
 */
// 2.1.183: getGrepDescription = m5r @cli_inner_pretty.js:221399-221418
export function getGrepDescription(model: string | undefined): string {
  if (isCompactPrompt(model)) {
    // @221401 (branch 1 — verbatim, em-dashes are real U+2014)
    return `Content search built on ripgrep. Prefer this over \`grep\`/\`rg\` via ${BASH_TOOL_NAME} — results integrate with the permission UI and file links.

- Full regex syntax (e.g. "log.*Error", "function\\s+\\w+"). Ripgrep, not grep — escape literal braces (\`interface\\{\\}\`).
- Filter with \`glob\` (e.g. "**/*.tsx") or \`type\` (e.g. "js", "py", "rust").
- \`output_mode\`: "content" (matching lines), "files_with_matches" (paths only, default), or "count".
- \`multiline: true\` for patterns that span lines.`
  }
  // @221409 (branch 2 — verbatim)
  return `A powerful search tool built on ripgrep

  Usage:
  - ALWAYS use ${GREP_TOOL_NAME} for search tasks. NEVER invoke \`grep\` or \`rg\` as a ${BASH_TOOL_NAME} command. The ${GREP_TOOL_NAME} tool has been optimized for correct permissions and access.
  - Supports full regex syntax (e.g., "log.*Error", "function\\s+\\w+")
  - Filter files with glob parameter (e.g., "*.js", "**/*.tsx") or type parameter (e.g., "js", "py", "rust")
  - Output modes: "content" shows matching lines, "files_with_matches" shows only file paths (default), "count" shows match counts
  - Use ${AGENT_TOOL_NAME} tool for open-ended searches requiring multiple rounds
  - Pattern syntax: Uses ripgrep (not grep) - literal braces need escaping (use \`interface\\{\\}\` to find \`interface{}\` in Go code)
  - Multiline matching: By default patterns match within single lines only. For cross-line patterns like \`struct \\{[\\s\\S]*?field\`, use \`multiline: true\`
`
}

// 2.1.183: inputSchema = Lbp @cli_inner_pretty.js:370676-370723
const inputSchema = lazySchema(() =>
  z.strictObject({
    pattern: z
      .string()
      .describe('The regular expression pattern to search for in file contents'),
    path: z
      .string()
      .optional()
      .describe(
        'File or directory to search in (rg PATH). Defaults to current working directory.',
      ),
    glob: z
      .string()
      .optional()
      .describe(
        'Glob pattern to filter files (e.g. "*.js", "*.{ts,tsx}") - maps to rg --glob',
      ),
    output_mode: z
      .enum(['content', 'files_with_matches', 'count'])
      .optional()
      .describe(
        'Output mode: "content" shows matching lines (supports -A/-B/-C context, -n line numbers, head_limit), "files_with_matches" shows file paths (supports head_limit), "count" shows match counts (supports head_limit). Defaults to "files_with_matches".',
      ),
    '-B': coerceNumber(z.number().optional()).describe(
      'Number of lines to show before each match (rg -B). Requires output_mode: "content", ignored otherwise.',
    ),
    '-A': coerceNumber(z.number().optional()).describe(
      'Number of lines to show after each match (rg -A). Requires output_mode: "content", ignored otherwise.',
    ),
    '-C': coerceNumber(z.number().optional()).describe('Alias for context.'),
    context: coerceNumber(z.number().optional()).describe(
      'Number of lines to show before and after each match (rg -C). Requires output_mode: "content", ignored otherwise.',
    ),
    '-n': coercedBoolean(z.boolean().optional()).describe(
      'Show line numbers in output (rg -n). Requires output_mode: "content", ignored otherwise. Defaults to true.',
    ),
    '-i': coercedBoolean(z.boolean().optional()).describe(
      'Case insensitive search (rg -i)',
    ),
    // NEW in 2.1.183 vs the 2.1.88 mirror: the `-o` only-matching field. @370700
    '-o': coercedBoolean(z.boolean().optional()).describe(
      'Print only the matched (non-empty) parts of each matching line, one match per output line (rg -o / --only-matching). Requires output_mode: "content", ignored otherwise. Defaults to false.',
    ),
    type: z
      .string()
      .optional()
      .describe(
        'File type to search (rg --type). Common types: js, py, rust, go, java, etc. More efficient than include for standard file types.',
      ),
    head_limit: coerceNumber(z.number().optional()).describe(
      // @370713 (verbatim)
      'Limit output to first N lines/entries, equivalent to "| head -N". Works across all output modes: content (limits output lines), files_with_matches (limits file paths), count (limits count entries). Defaults to 250 when unspecified. Pass 0 for unlimited (use sparingly — large result sets waste context).',
    ),
    offset: coerceNumber(z.number().optional()).describe(
      // @370716 (verbatim — pagination)
      'Skip first N lines/entries before applying head_limit, equivalent to "| tail -n +N | head -N". Works across all output modes. Defaults to 0.',
    ),
    multiline: coercedBoolean(z.boolean().optional()).describe(
      'Enable multiline mode where . matches newlines and patterns can span lines (rg -U --multiline-dotall). Default: false.',
    ),
  }),
)
type InputSchema = ReturnType<typeof inputSchema>

// 2.1.183: VCS_DIRECTORIES_TO_EXCLUDE = Dbp @cli_inner_pretty.js:370724
const VCS_DIRECTORIES_TO_EXCLUDE = [
  '.git',
  '.svn',
  '.hg',
  '.bzr',
  '.jj',
  '.sl',
] as const

// 2.1.183: DEFAULT_HEAD_LIMIT = Pbp = 250 @cli_inner_pretty.js:370655
const DEFAULT_HEAD_LIMIT = 250

// 2.1.183: applyHeadLimit = sio @cli_inner_pretty.js:370640-370646
// limit===0 => unlimited escape hatch; else slice [offset, offset+limit); only
// report appliedLimit when truncation actually happened (so the model can paginate).
function applyHeadLimit<T>(
  items: T[],
  limit: number | undefined,
  offset = 0,
): { items: T[]; appliedLimit: number | undefined } {
  if (limit === 0) {
    return { items: items.slice(offset), appliedLimit: undefined }
  }
  const effectiveLimit = limit ?? DEFAULT_HEAD_LIMIT
  const sliced = items.slice(offset, offset + effectiveLimit)
  const wasTruncated = items.length - offset > effectiveLimit
  return { items: sliced, appliedLimit: wasTruncated ? effectiveLimit : undefined }
}

// 2.1.183: formatLimitInfo = iio @cli_inner_pretty.js:370647-370653
function formatLimitInfo(
  appliedLimit: number | undefined,
  appliedOffset: number | undefined,
): string {
  const parts: string[] = []
  if (appliedLimit !== undefined) parts.push(`limit: ${appliedLimit}`)
  if (appliedOffset) parts.push(`offset: ${appliedOffset}`)
  return parts.join(', ')
}

// 2.1.183: outputSchema = Mbp @cli_inner_pretty.js:370727-370738
const outputSchema = lazySchema(() =>
  z.object({
    mode: z.enum(['content', 'files_with_matches', 'count']).optional(),
    numFiles: z.number(),
    filenames: z.array(z.string()),
    content: z.string().optional(),
    numLines: z.number().optional(), // content mode
    numMatches: z.number().optional(), // count mode
    appliedLimit: z.number().optional(),
    appliedOffset: z.number().optional(),
  }),
)
type OutputSchema = ReturnType<typeof outputSchema>
type Output = z.infer<OutputSchema>

// 2.1.183: GrepTool = OR = pi({...}) @cli_inner_pretty.js:370736-370920
export const GrepTool = buildTool({
  name: GREP_TOOL_NAME,
  searchHint: 'search file contents with regex (ripgrep)', // @370738
  maxResultSizeChars: 20_000, // @370739 — tool-result persistence threshold
  strict: true, // @370740
  async description() {
    return getGrepDescription(undefined) // @370742 — m5r(void 0)
  },
  userFacingName() {
    return 'Search' // @370745
  },
  getToolUseSummary: getActivityDescriptionSummary,
  getActivityDescription(input) {
    const summary = getActivityDescriptionSummary(input)
    return summary ? `Searching for ${summary}` : 'Searching'
  },
  get inputSchema(): InputSchema {
    return inputSchema()
  },
  get outputSchema(): OutputSchema {
    return outputSchema()
  },
  isConcurrencySafe() {
    return true
  },
  isReadOnly() {
    return true
  },
  toAutoClassifierInput(input) {
    return input.path ? `${input.pattern} in ${input.path}` : input.pattern
  },
  isSearchOrReadCommand() {
    return { isSearch: true, isRead: false }
  },
  ruleContentField: 'path', // @370770
  getPath({ path }): string {
    return path || getCwd() // @370771 — note: NOT expanded here (matches 183 bundle)
  },
  async preparePermissionMatcher({ pattern }) {
    return rulePattern => matchWildcardPattern(rulePattern, pattern) // @370774 (t8)
  },
  async validateInput({ pattern, path, glob, type }): Promise<ValidationResult> {
    // @370777 — reject any field carrying a NUL byte (would corrupt the rg argv)
    const nullByteField = (
      [
        ['pattern', pattern],
        ['path', path],
        ['glob', glob],
        ['type', type],
      ] as const
    ).find(([, value]) => value?.includes('\x00'))
    if (nullByteField) {
      return {
        result: false,
        // @370787 (verbatim, errorCode 2)
        message: `${GREP_TOOL_NAME} ${nullByteField[0]} cannot contain null bytes (\\0). Remove the null byte and try again.`,
        errorCode: 2,
      }
    }

    // @370790 — when a path is given, confirm it exists (ENOENT => errorCode 1)
    if (path) {
      const fs = getFsImplementation()
      const absolutePath = resolveToCwd(path)
      // SECURITY: skip filesystem ops for UNC paths to prevent NTLM credential leaks. @370793
      if (absolutePath.startsWith('\\\\') || absolutePath.startsWith('//')) {
        return { result: true }
      }
      try {
        await fs.stat(absolutePath)
      } catch (e: unknown) {
        if (isENOENT(e)) {
          const suggestion = await findSimilarFile(absolutePath)
          // @370799 (verbatim, errorCode 1)
          let message = `Path does not exist: ${path}. ${FILE_NOT_FOUND_CWD_NOTE} ${getCwd()}.`
          if (suggestion) message += ` Did you mean ${suggestion}?`
          return { result: false, message, errorCode: 1 }
        }
        throw e
      }
    }
    return { result: true }
  },
  async checkPermissions(input, context): Promise<PermissionDecision> {
    // @370808 — read-only permission helper (_te)
    return checkReadPermissionForTool(
      GrepTool,
      input,
      getToolPermissionContext(context),
    )
  },
  async prompt({ model }) {
    return getGrepDescription(model) // @370811 — model-branched: return m5r(e)
  },
  renderToolUseMessage,
  renderToolUseErrorMessage,
  renderToolResultMessage,
  extractSearchText({ mode, content, filenames }) {
    if (mode === 'content' && content) return content
    return filenames.join('\n')
  },
  mapToolResultToToolResultBlockParam(
    {
      mode = 'files_with_matches',
      numFiles,
      filenames,
      content,
      numMatches,
      appliedLimit,
      appliedOffset,
    },
    toolUseID,
  ) {
    // @370823 — content mode: optional pagination banner
    if (mode === 'content') {
      const limitInfo = formatLimitInfo(appliedLimit, appliedOffset)
      const resultContent = content || 'No matches found'
      const finalContent = limitInfo
        ? `${resultContent}\n\n[Showing results with pagination = ${limitInfo}]`
        : resultContent
      return { tool_use_id: toolUseID, type: 'tool_result', content: finalContent }
    }
    // @370833 — count mode: per-file lines + a summary line
    if (mode === 'count') {
      const limitInfo = formatLimitInfo(appliedLimit, appliedOffset)
      const rawContent = content || 'No matches found'
      const matches = numMatches ?? 0
      const files = numFiles ?? 0
      const summary = `\n\nFound ${matches} total ${matches === 1 ? 'occurrence' : 'occurrences'} across ${files} ${files === 1 ? 'file' : 'files'}.${limitInfo ? ` with pagination = ${limitInfo}` : ''}`
      return { tool_use_id: toolUseID, type: 'tool_result', content: rawContent + summary }
    }
    // @370843 — files_with_matches mode
    const limitInfo = formatLimitInfo(appliedLimit, appliedOffset)
    if (numFiles === 0) {
      return { tool_use_id: toolUseID, type: 'tool_result', content: 'No files found' }
    }
    const result = `Found ${numFiles} ${plural(numFiles, 'file')}${limitInfo ? ` ${limitInfo}` : ''}\n${filenames.join('\n')}`
    return { tool_use_id: toolUseID, type: 'tool_result', content: result }
  },
  async call(
    {
      pattern,
      path,
      glob,
      type,
      output_mode = 'files_with_matches',
      '-B': contextBefore,
      '-A': contextAfter,
      '-C': contextC,
      context,
      '-n': showLineNumbers = true,
      '-i': caseInsensitive = false,
      '-o': onlyMatching = false,
      head_limit: headLimit,
      offset = 0,
      multiline = false,
    },
    { abortController, ...toolContext },
  ) {
    // ============================================================
    // ripgrep arg-build (reconstructed core) — @cli_inner_pretty.js:370880-370916
    // ============================================================
    const absolutePath = path ? resolveToCwd(path) : getCwd() // h = t ? Ds(t) : Pt()
    const args = ['--hidden'] // @370884

    // Exclude VCS metadata dirs (noise). @370885
    for (const dir of VCS_DIRECTORIES_TO_EXCLUDE) {
      args.push('--glob', `!${dir}`)
    }
    // Cap column width so base64/minified lines don't flood output. @370886
    args.push('--max-columns', '500')

    if (multiline) args.push('-U', '--multiline-dotall') // @370886
    if (caseInsensitive) args.push('-i') // @370887

    // Output-mode flags. NOTE: 183 adds `-H` to count mode (force per-file headers). @370888-370889
    if (output_mode === 'files_with_matches') args.push('-l')
    else if (output_mode === 'count') args.push('-c', '-H')

    if (showLineNumbers && output_mode === 'content') args.push('-n') // @370890
    if (onlyMatching && output_mode === 'content') args.push('-o') // @370891 (NEW field wiring)

    // Context flags (content only): -C/context wins over -B/-A. @370892-370897
    if (output_mode === 'content') {
      if (context !== undefined) args.push('-C', context.toString())
      else if (contextC !== undefined) args.push('-C', contextC.toString())
      else {
        if (contextBefore !== undefined) args.push('-B', contextBefore.toString())
        if (contextAfter !== undefined) args.push('-A', contextAfter.toString())
      }
    }

    // Pattern: leading-dash patterns use `-e` so rg doesn't read them as flags. @370899
    if (pattern.startsWith('-')) args.push('-e', pattern)
    else args.push(pattern)

    if (type) args.push('--type', type) // @370901

    // glob: split on whitespace; brace-groups kept whole, others comma-split. @370903-370908
    if (glob) {
      const globPatterns: string[] = []
      for (const raw of glob.split(/\s+/)) {
        if (raw.includes('{') && raw.includes('}')) globPatterns.push(raw)
        else globPatterns.push(...raw.split(',').filter(Boolean))
      }
      for (const g of globPatterns.filter(Boolean)) args.push('--glob', g)
    }

    // Workspace deny globs (permission-context ignores). Relative => prefix **/.  @370909-370913
    const denyGlobs = normalizeWorkspaceDenyGlobs(
      getToolPermissionContext(toolContext),
      getCwd(),
    )
    for (const g of denyGlobs) {
      args.push('--glob', g.startsWith('/') ? `!${g}` : `!**/${g}`)
    }
    // Project ignore globs (e.g. orphaned-plugin filter). @370915
    for (const g of await getProjectIgnoreGlobs(absolutePath)) {
      args.push('--glob', g)
    }

    // Exec ripgrep. A timeout throws RipgrepTimeoutError (propagates — so the
    // model knows the search didn't complete rather than seeing "no matches"). @370918 (Zie)
    const results = await ripGrep(args, absolutePath, abortController.signal)

    // ---- content mode ----
    if (output_mode === 'content') {
      // Paginate first (de-prefix is per-line work — skip discarded lines). @370919 (sio)
      const { items, appliedLimit } = applyHeadLimit(results, headLimit, offset)
      const finalLines = items.map(line => {
        // Lines: /abs/path:content or /abs/path:N:content. Windows drive
        // letter (C:) must not be mistaken for the path:content separator. @370921
        const driveOffset = /^[A-Za-z]:/.test(line) ? 2 : 0
        const colon = line.indexOf(':', driveOffset)
        if (colon > 0) {
          return toRelativePath(line.substring(0, colon)) + line.substring(colon)
        }
        return line
      })
      return {
        data: {
          mode: 'content' as const,
          numFiles: 0,
          filenames: [],
          content: finalLines.join('\n'),
          numLines: finalLines.length,
          ...(appliedLimit !== undefined && { appliedLimit }),
          ...(offset > 0 && { appliedOffset: offset }),
        },
      }
    }

    // ---- count mode (filename:count) ----
    if (output_mode === 'count') {
      const { items, appliedLimit } = applyHeadLimit(results, headLimit, offset)
      const finalLines = items.map(line => {
        const colon = line.lastIndexOf(':')
        if (colon > 0) {
          return toRelativePath(line.substring(0, colon)) + line.substring(colon)
        }
        return line
      })
      let totalMatches = 0
      let fileCount = 0
      for (const line of finalLines) {
        const colon = line.lastIndexOf(':')
        if (colon > 0) {
          const count = parseInt(line.substring(colon + 1), 10)
          if (!isNaN(count)) {
            totalMatches += count
            fileCount += 1
          }
        }
      }
      return {
        data: {
          mode: 'count' as const,
          numFiles: fileCount,
          filenames: [],
          content: finalLines.join('\n'),
          numMatches: totalMatches,
          ...(appliedLimit !== undefined && { appliedLimit }),
          ...(offset > 0 && { appliedOffset: offset }),
        },
      }
    }

    // ---- files_with_matches mode (default) ----
    // allSettled so one ENOENT (file deleted between scan and stat) doesn't
    // reject the batch; failed stats sort as mtime 0.
    const stats = await Promise.allSettled(
      results.map(file => getFsImplementation().stat(file)),
    )
    const sortedMatches = results
      .map((file, i) => {
        const r = stats[i]!
        return [file, r.status === 'fulfilled' ? (r.value.mtimeMs ?? 0) : 0] as const
      })
      .sort((a, b) => {
        const byTime = b[1] - a[1]
        return byTime === 0 ? a[0].localeCompare(b[0]) : byTime
      })
      .map(entry => entry[0])

    const { items, appliedLimit } = applyHeadLimit(sortedMatches, headLimit, offset)
    const relativeMatches = items.map(toRelativePath)
    return {
      data: {
        mode: 'files_with_matches' as const,
        filenames: relativeMatches,
        numFiles: relativeMatches.length,
        ...(appliedLimit !== undefined && { appliedLimit }),
        ...(offset > 0 && { appliedOffset: offset }),
      },
    }
  },
} satisfies ToolDef<InputSchema, Output>)
