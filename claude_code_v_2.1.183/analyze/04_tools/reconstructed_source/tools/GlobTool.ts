/**
 * GlobTool — fast file-pattern matching ("Glob"), read-only search tool.
 *
 * Readable-source reconstruction of the v2.1.183 obfuscated tool object. Logic
 * is byte-for-byte the 2.1.88 `src/tools/GlobTool/GlobTool.ts` convention with
 * the model-branched `prompt({model})` (compact branch) and `ruleContentField`
 * additions present in 2.1.183.
 *
 * 2.1.183 regions covered (PRIMARY: cli_inner_pretty.js, 699,346 lines):
 *   - name const  `_u = "Glob"`                                   @152243
 *   - description `WNr` (verbatim 5-bullet)                        @152244-152248
 *   - prompt fn   `Fgi(model)` (compact branch + WNr fallback)    @152238-152242
 *   - input schema `Rbp` (we(() => H.strictObject({...})))         @371054-371063
 *   - output schema `$bp`                                          @371064-371071
 *   - tool object `hj = pi({...})`                                 @371072-371166
 * 2.1.88 convention mirror: src/tools/GlobTool/GlobTool.ts (+ prompt.ts)
 * 2.1.156 scaffold: claude_code_v_2.1.156/analyze/04_tools/README.md
 * Cross-validation: re-read every line above in the 183 bundle; schema field
 *   list (pattern, path), describe strings, the two truncation/permission error
 *   strings, and `getPath`/`preparePermissionMatcher` all match the bundle.
 */

import { z } from 'zod/v4'
import type { ValidationResult } from '../Tool'
import { buildTool, type ToolDef } from '../Tool'
import { getCwd } from '../../utils/cwd' // 2.1.183: getCwd = Pt @ubiquitous
import { isENOENT } from '../../utils/errors' // 2.1.183: isENOENT = Pn
import {
  FILE_NOT_FOUND_CWD_NOTE, // 2.1.183: FILE_NOT_FOUND_CWD_NOTE = bN (path-suggestion preamble)
  findSimilarFile, // 2.1.183: findSimilarFile = uoe @371122
} from '../../utils/file'
import { getFsImplementation } from '../../utils/fsOperations' // 2.1.183: getFsImplementation = Ut
import { glob } from '../../utils/glob' // 2.1.183: glob engine = QMa @371163
import { lazySchema } from '../../utils/lazySchema' // 2.1.183: we(...)
import { resolveToCwd, toRelativePath } from '../../utils/path' // 2.1.183: resolveToCwd = Ds (canonical), toRelativePath = Cze @48185
import { checkReadPermissionForTool } from '../../utils/permissions/filesystem' // 2.1.183: _te @574749
import { getToolPermissionContext } from '../../utils/permissions/context' // 2.1.183: Br(ctx)
import type { PermissionDecision } from '../../utils/permissions/PermissionResult'
import { matchWildcardPattern } from '../../utils/permissions/shellRuleMatching' // 2.1.183: t8 (glob/pattern matcher)
import {
  getActivityDescriptionSummary, // helper: aio @371165 — summarizes pattern for activity line
  renderToolResultMessage, // helper: lRa @371166
  renderToolUseErrorMessage, // helper: aRa
  renderToolUseMessage, // helper: iRa
  userFacingName, // helper: sRa
} from './UI'

// 2.1.183: GLOB_TOOL_NAME = _u @cli_inner_pretty.js:152243
export const GLOB_TOOL_NAME = 'Glob'

// 2.1.183: DESCRIPTION = WNr @cli_inner_pretty.js:152244-152248 (verbatim; mirrors assets/tools/Glob.md "## Description")
export const DESCRIPTION = `- Fast file pattern matching tool that works with any codebase size
- Supports glob patterns like "**/*.js" or "src/**/*.ts"
- Returns matching file paths sorted by modification time
- Use this tool when you need to find files by name patterns
- When you are doing an open ended search that may require multiple rounds of globbing and grepping, use the Agent tool instead`

/**
 * Model-branched prompt. In the compact/lean system-prompt cohort (`Dg(model)`)
 * the description is trimmed to a single line; otherwise the full 5-bullet
 * `DESCRIPTION` is returned (assets/tools/Glob.md "## Prompt --- branch 1/2 ---").
 */
// 2.1.183: getGlobPrompt = Fgi @cli_inner_pretty.js:152238-152242
export function getGlobPrompt(model: string | undefined): string {
  // @152240 compact branch (Dg(model) — lean/simple-system-prompt cohort)
  if (isCompactPrompt(model)) {
    return 'Fast file pattern matching. Supports glob patterns like "**/*.js" or "src/**/*.ts". Returns matching file paths sorted by modification time.'
  }
  return DESCRIPTION
}
// helper: Dg @ — lean/compact-prompt predicate (true => trimmed prompt)
declare function isCompactPrompt(model: string | undefined): boolean

// 2.1.183: inputSchema = Rbp @cli_inner_pretty.js:371054-371063
const inputSchema = lazySchema(() =>
  z.strictObject({
    pattern: z.string().describe('The glob pattern to match files against'), // @371056
    path: z
      .string()
      .optional()
      .describe(
        // @371060 (verbatim; mirrors assets/tools/Glob.md)
        'The directory to search in. If not specified, the current working directory will be used. IMPORTANT: Omit this field to use the default directory. DO NOT enter "undefined" or "null" - simply omit it for the default behavior. Must be a valid directory path if provided.',
      ),
  }),
)
type InputSchema = ReturnType<typeof inputSchema>

// 2.1.183: outputSchema = $bp @cli_inner_pretty.js:371064-371071
const outputSchema = lazySchema(() =>
  z.object({
    durationMs: z
      .number()
      .describe('Time taken to execute the search in milliseconds'),
    numFiles: z.number().describe('Total number of files found'),
    filenames: z
      .array(z.string())
      .describe('Array of file paths that match the pattern'),
    truncated: z
      .boolean()
      .describe('Whether results were truncated (limited to 100 files)'),
  }),
)
type OutputSchema = ReturnType<typeof outputSchema>
export type Output = z.infer<OutputSchema>

// 2.1.183: GlobTool = hj = pi({...}) @cli_inner_pretty.js:371072-371166
export const GlobTool = buildTool({
  name: GLOB_TOOL_NAME,
  searchHint: 'find files by name pattern or wildcard', // @371074
  maxResultSizeChars: 100_000, // @371075 (1e5)
  async description() {
    return DESCRIPTION
  },
  userFacingName,
  getToolUseSummary: getActivityDescriptionSummary,
  getActivityDescription(input) {
    const summary = getActivityDescriptionSummary(input)
    return summary ? `Finding ${summary}` : 'Finding files' // @371083
  },
  get inputSchema(): InputSchema {
    return inputSchema()
  },
  get outputSchema(): OutputSchema {
    return outputSchema()
  },
  isConcurrencySafe() {
    return true // @371091
  },
  isReadOnly() {
    return true // @371094
  },
  toAutoClassifierInput(input) {
    return input.pattern
  },
  isSearchOrReadCommand() {
    return { isSearch: true, isRead: false }
  },
  ruleContentField: 'path', // @371103 — permission rules match on the `path` arg
  getPath({ path }): string {
    // @371104 — resolve to absolute (resolveToCwd=Ds) or fall back to cwd (Pt)
    return path ? resolveToCwd(path) : getCwd()
  },
  async preparePermissionMatcher({ pattern }) {
    // @371107 — Glob matches permission rules by glob/wildcard (t8), not path equality
    return rulePattern => matchWildcardPattern(rulePattern, pattern)
  },
  async validateInput({ path }): Promise<ValidationResult> {
    // @371110 — only validate when an explicit `path` was provided
    if (path) {
      const fs = getFsImplementation()
      const absolutePath = resolveToCwd(path)

      // SECURITY: skip filesystem ops for UNC paths to prevent NTLM credential leaks. @371114
      if (absolutePath.startsWith('\\\\') || absolutePath.startsWith('//')) {
        return { result: true }
      }

      let stats
      try {
        stats = await fs.stat(absolutePath)
      } catch (e: unknown) {
        if (isENOENT(e)) {
          const suggestion = await findSimilarFile(absolutePath)
          // @371121 (verbatim, errorCode 1)
          let message = `Directory does not exist: ${path}. ${FILE_NOT_FOUND_CWD_NOTE} ${getCwd()}.`
          if (suggestion) {
            message += ` Did you mean ${suggestion}?`
          }
          return { result: false, message, errorCode: 1 }
        }
        throw e
      }

      if (!stats.isDirectory()) {
        // @371127 (verbatim, errorCode 2)
        return {
          result: false,
          message: `Path is not a directory: ${path}`,
          errorCode: 2,
        }
      }
    }
    return { result: true }
  },
  async checkPermissions(input, context): Promise<PermissionDecision> {
    // @371131 — read-only permission helper (_te); path/pattern resolved via getPath
    return checkReadPermissionForTool(
      GlobTool,
      input,
      getToolPermissionContext(context),
    )
  },
  async prompt({ model }) {
    // @371134 — model-branched (compact vs full): return Fgi(e)
    return getGlobPrompt(model)
  },
  renderToolUseMessage,
  renderToolUseErrorMessage,
  renderToolResultMessage,
  // Reuses Grep's content renderer; durationMs/numFiles are display chrome.
  extractSearchText({ filenames }) {
    return filenames.join('\n')
  },
  async call(input, { abortController, globLimits, ...context }) {
    // @371144
    const start = Date.now()
    const limit = globLimits?.maxResults ?? 100 // @371147 — default cap of 100 files
    const { files, truncated } = await glob(
      input.pattern,
      GlobTool.getPath(input),
      { limit, offset: 0 },
      abortController.signal,
      getToolPermissionContext(context), // Br(t)
    )
    // Relativize paths under cwd to save tokens (toRelativePath=Cze).
    const filenames = files.map(toRelativePath)
    const output: Output = {
      filenames,
      durationMs: Date.now() - start,
      numFiles: filenames.length,
      truncated,
    }
    return { data: output }
  },
  mapToolResultToToolResultBlockParam(output, toolUseID) {
    // @371152
    if (output.filenames.length === 0) {
      return {
        tool_use_id: toolUseID,
        type: 'tool_result',
        content: 'No files found',
      }
    }
    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content: [
        ...output.filenames,
        ...(output.truncated
          ? [
              // @371159 (verbatim truncation banner)
              '(Results are truncated. Consider using a more specific path or pattern.)',
            ]
          : []),
      ].join('\n'),
    }
  },
} satisfies ToolDef<InputSchema, Output>)
