/**
 * LSPTool — code intelligence via Language Server Protocol ("LSP"), read-only,
 * deferred, gated on an active LSP connection. Contract-level reconstruction of
 * the v2.1.183 obfuscated tool object; deep formatter/manager internals are
 * summarized with source anchors.
 *
 * 2.1.183 regions covered (PRIMARY: cli_inner_pretty.js):
 *   - name const  `Vlt = "LSP"`                                   @368922
 *   - description/prompt `qso` (verbatim, incl. NEW workspaceSymbol
 *     `query` paragraph)                                          @368923-368945
 *   - input schema `SMp` (operation/filePath/line/character + NEW
 *     `query` field)                                              @429547-429568
 *   - output schema `EMp`                                         @429569-429590
 *   - tool object `Opo = pi({...})`                               @429593-429765
 *   - method/param map `HMp` (workspaceSymbol => query ?? "")     @429367-429392
 *   - enablement `lsa = aje.isConnected`                          @289753
 *   - max-file-size `bMp = 1e7` (10MB)                            @429524
 * 2.1.88 convention mirror: src/tools/LSPTool/{LSPTool.ts,schemas.ts,prompt.ts}
 *   — same shape; 183 ADDS the optional `query` field (workspaceSymbol) and
 *   wires `query ?? ""` into the `workspace/symbol` request (88 hardcoded "").
 * 2.1.156 scaffold: claude_code_v_2.1.156/analyze/04_tools/README.md
 * Cross-validation: re-read the schema, validateInput error strings (codes
 *   1/2/3/4), the call() "too large"/"no server" strings, and HMp's
 *   workspaceSymbol query branch in the 183 bundle — all match.
 */

import { open } from 'fs/promises' // 2.1.183: P8a.open
import * as path from 'path' // 2.1.183: $po (extname)
import { pathToFileURL } from 'url' // 2.1.183: M8a.pathToFileURL
import type {
  CallHierarchyItem,
  DocumentSymbol,
  Location,
  LocationLink,
  SymbolInformation,
} from 'vscode-languageserver-types'
import { z } from 'zod/v4'
import {
  getInitializationStatus, // 2.1.183: Dot @429654 (call site)
  getLspServerManager, // 2.1.183: pxe @429655 (call site)
  isLspConnected, // 2.1.183: lsa @289753
  waitForInitialization, // 2.1.183: csa @429654 (call site)
} from '../../services/lsp/manager'
import type { ValidationResult } from '../Tool'
import { buildTool, type ToolDef } from '../Tool'
import { getCwd } from '../../utils/cwd' // 2.1.183: Pt
import { logForDebugging } from '../../utils/debug' // 2.1.183: v(...)
import { isENOENT, toError } from '../../utils/errors' // 2.1.183: isENOENT = Pn, toError = yo
import { getFsImplementation } from '../../utils/fsOperations' // 2.1.183: Ut
import { lazySchema } from '../../utils/lazySchema' // we(...)
import { logError } from '../../utils/log' // 2.1.183: De / v(..., {level:"error"})
import { resolveToCwd } from '../../utils/path' // 2.1.183: Ds (canonical readable: resolveToCwd)
import { checkReadPermissionForTool } from '../../utils/permissions/filesystem' // 2.1.183: _te
import { getToolPermissionContext } from '../../utils/permissions/context' // 2.1.183: Br(ctx)
import type { PermissionDecision } from '../../utils/permissions/PermissionResult'
import {
  renderToolResultMessage, // helper: k8a
  renderToolUseErrorMessage, // helper: x8a
  renderToolUseMessage, // helper: I8a
  userFacingName, // helper: C8a
} from './UI'

// 2.1.183: MAX_LSP_FILE_SIZE_BYTES = bMp = 1e7 @cli_inner_pretty.js:429524
const MAX_LSP_FILE_SIZE_BYTES = 10_000_000

// 2.1.183: LSP_TOOL_NAME = Vlt @cli_inner_pretty.js:368922
export const LSP_TOOL_NAME = 'LSP' as const

const LSP_OPERATIONS = [
  'goToDefinition',
  'findReferences',
  'hover',
  'documentSymbol',
  'workspaceSymbol',
  'goToImplementation',
  'prepareCallHierarchy',
  'incomingCalls',
  'outgoingCalls',
] as const

// 2.1.183: DESCRIPTION/prompt = qso @cli_inner_pretty.js:368923-368945 (verbatim;
// mirrors assets/tools/LSP.md "## Description" + "## Prompt"). The em-dash in the
// workspaceSymbol line is real U+2014. The `query`/workspaceSymbol paragraph is NEW.
export const DESCRIPTION = `Interact with Language Server Protocol (LSP) servers to get code intelligence features.

Supported operations:
- goToDefinition: Find where a symbol is defined
- findReferences: Find all references to a symbol
- hover: Get hover information (documentation, type info) for a symbol
- documentSymbol: Get all symbols (functions, classes, variables) in a document
- workspaceSymbol: Search for symbols matching a query across the entire workspace
- goToImplementation: Find implementations of an interface or abstract method
- prepareCallHierarchy: Get call hierarchy item at a position (functions/methods)
- incomingCalls: Find all functions/methods that call the function at a position
- outgoingCalls: Find all functions/methods called by the function at a position

All operations require:
- filePath: The file to operate on
- line: The line number (1-based, as shown in editors)
- character: The character offset (1-based, as shown in editors)

The workspaceSymbol operation also takes:
- query: The symbol name or partial name to search for. Always provide it — most language servers return no results for an empty query.

Note: LSP servers must be configured for the file type. If no server is available, an error will be returned.`

/**
 * Tool-compatible input schema (a flat strictObject rather than a discriminated
 * union; the discriminated union `lspToolInputSchema` is used in validateInput
 * for sharper error messages — see `validateInput` below).
 */
// 2.1.183: inputSchema = SMp @cli_inner_pretty.js:429547-429568
const inputSchema = lazySchema(() =>
  z.strictObject({
    operation: z.enum(LSP_OPERATIONS).describe('The LSP operation to perform'),
    filePath: z.string().describe('The absolute or relative path to the file'),
    line: z
      .number()
      .int()
      .positive()
      .describe('The line number (1-based, as shown in editors)'),
    character: z
      .number()
      .int()
      .positive()
      .describe('The character offset (1-based, as shown in editors)'),
    // NEW in 2.1.183: optional `query` for workspaceSymbol. @429563
    query: z
      .string()
      .optional()
      .describe(
        'The symbol name or partial name to search for (workspaceSymbol only). Most language servers return no results for an empty query, so always provide it when using workspaceSymbol.',
      ),
  }),
)
type InputSchema = ReturnType<typeof inputSchema>

// 2.1.183: outputSchema = EMp @cli_inner_pretty.js:429569-429590
const outputSchema = lazySchema(() =>
  z.object({
    operation: z.enum(LSP_OPERATIONS).describe('The LSP operation that was performed'),
    result: z.string().describe('The formatted result of the LSP operation'),
    filePath: z.string().describe('The file path the operation was performed on'),
    resultCount: z
      .number()
      .int()
      .nonnegative()
      .optional()
      .describe('Number of results (definitions, references, symbols)'),
    fileCount: z
      .number()
      .int()
      .nonnegative()
      .optional()
      .describe('Number of files containing results'),
  }),
)
type OutputSchema = ReturnType<typeof outputSchema>
export type Output = z.infer<OutputSchema>
export type Input = z.infer<InputSchema>

// helper: S8a @ — lazy discriminated-union schema for the 9 operations (sharper errors)
declare function lspToolInputSchema(): { safeParse(input: unknown): { success: boolean; error?: { message: string } } }
// helper: wMp @429441 — formatResult(operation, raw, cwd) => {formatted, resultCount, fileCount}
declare function formatResult(operation: Input['operation'], result: unknown, cwd: string): { formatted: string; resultCount: number; fileCount: number }
// helper: D8a @429410 — filterGitIgnoredLocations(locations, cwd) via batched `git check-ignore`
declare function filterGitIgnoredLocations<T extends Location>(locations: T[], cwd: string): Promise<T[]>
// helper: Y3n @429437 — toLocation(item): LocationLink => Location normalization
declare function toLocation(item: Location | LocationLink): Location

// 2.1.183: LSPTool = Opo = pi({...}) @cli_inner_pretty.js:429593-429765
export const LSPTool = buildTool({
  name: LSP_TOOL_NAME,
  searchHint: 'code intelligence (definitions, references, symbols, hover)', // @429595
  maxResultSizeChars: 100_000, // @429596 (1e5)
  isLsp: true, // @429597
  async description() {
    return DESCRIPTION
  },
  userFacingName,
  shouldDefer: true, // @429602 — deferred tool (loaded on demand)
  isEnabled() {
    return isLspConnected() // @429603 — gated on an active LSP connection (lsa)
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
  ruleContentField: 'filePath', // @429618
  getPath({ filePath }): string {
    return resolveToCwd(filePath) // @429619 (Ds)
  },
  async validateInput(input: Input): Promise<ValidationResult> {
    // @429622 — re-validate against the discriminated union for sharper messages
    const parsed = lspToolInputSchema().safeParse(input)
    if (!parsed.success) {
      return {
        result: false,
        message: `Invalid input: ${parsed.error!.message}`, // @429624 (errorCode 3)
        errorCode: 3,
      }
    }

    const fs = getFsImplementation()
    const absolutePath = resolveToCwd(input.filePath)
    // SECURITY: skip filesystem ops for UNC paths to prevent NTLM credential leaks. @429627
    if (absolutePath.startsWith('\\\\') || absolutePath.startsWith('//')) {
      return { result: true }
    }

    let stats
    try {
      stats = await fs.stat(absolutePath)
    } catch (error) {
      if (isENOENT(error)) {
        // @429632 (errorCode 1)
        return {
          result: false,
          message: `File does not exist: ${input.filePath}`,
          errorCode: 1,
        }
      }
      const err = toError(error)
      logError(
        new Error(
          `Failed to access file stats for LSP operation on ${input.filePath}: ${err.message}`,
        ),
      )
      // @429636 (errorCode 4)
      return {
        result: false,
        message: `Cannot access file: ${input.filePath}. ${err.message}`,
        errorCode: 4,
      }
    }

    if (!stats.isFile()) {
      // @429639 (errorCode 2)
      return {
        result: false,
        message: `Path is not a file: ${input.filePath}`,
        errorCode: 2,
      }
    }
    return { result: true }
  },
  async checkPermissions(input, context): Promise<PermissionDecision> {
    // @429643 — read-only permission helper (_te); no preparePermissionMatcher (path via getPath)
    return checkReadPermissionForTool(
      LSPTool,
      input,
      getToolPermissionContext(context),
    )
  },
  async prompt() {
    return DESCRIPTION // @429645 — same text as description (no model branch)
  },
  renderToolUseMessage,
  renderToolUseErrorMessage,
  renderToolResultMessage,
  async call(input: Input, _context) {
    // @429651
    const absolutePath = resolveToCwd(input.filePath)
    const cwd = getCwd()

    // Wait for a still-pending LSP init so we don't falsely report "no server". @429654
    if (getInitializationStatus().status === 'pending') {
      await waitForInitialization()
    }

    const manager = getLspServerManager() // @429655 (pxe)
    if (!manager) {
      logError(new Error('LSP server manager not initialized when tool was called'))
      return {
        data: {
          operation: input.operation,
          // @429662 (verbatim)
          result: 'LSP server manager not initialized. This may indicate a startup issue.',
          filePath: input.filePath,
        },
      }
    }

    const { method, params } = getMethodAndParams(input, absolutePath) // @429667 (HMp)

    try {
      // Most servers require textDocument/didOpen first; open lazily (skip the
      // I/O if the file is already open). Reject files over the 10MB cap. @429669
      if (!manager.isFileOpen(absolutePath)) {
        const handle = await open(absolutePath, 'r')
        try {
          const stats = await handle.stat()
          if (stats.size > MAX_LSP_FILE_SIZE_BYTES) {
            return {
              data: {
                operation: input.operation,
                // @429677 (verbatim)
                result: `File too large for LSP analysis (${Math.ceil(stats.size / 1_000_000)}MB exceeds 10MB limit)`,
                filePath: input.filePath,
              },
            }
          }
          const fileContent = await handle.readFile({ encoding: 'utf-8' })
          await manager.openFile(absolutePath, fileContent)
        } finally {
          await handle.close()
        }
      }

      let result = await manager.sendRequest(absolutePath, method, params)

      if (result === undefined) {
        logForDebugging(
          `No LSP server available for file type ${path.extname(absolutePath)} for operation ${input.operation} on file ${input.filePath}`,
        )
        return {
          data: {
            operation: input.operation,
            // @429696 (verbatim)
            result: `No LSP server available for file type: ${path.extname(absolutePath)}`,
            filePath: input.filePath,
          },
        }
      }

      // incoming/outgoing calls are two-step: prepareCallHierarchy first, then
      // request the actual calls using the first returned item. @429702
      if (input.operation === 'incomingCalls' || input.operation === 'outgoingCalls') {
        const callItems = result as CallHierarchyItem[]
        if (!callItems || callItems.length === 0) {
          return {
            data: {
              operation: input.operation,
              // @429707 (verbatim)
              result: 'No call hierarchy item found at this position',
              filePath: input.filePath,
              resultCount: 0,
              fileCount: 0,
            },
          }
        }
        const callMethod =
          input.operation === 'incomingCalls'
            ? 'callHierarchy/incomingCalls'
            : 'callHierarchy/outgoingCalls'
        result = await manager.sendRequest(absolutePath, callMethod, { item: callItems[0] })
        if (result === undefined) {
          logForDebugging(`LSP server returned undefined for ${callMethod} on ${input.filePath}`)
        }
      }

      // Filter gitignored files out of location-based results. @429716
      if (
        result &&
        Array.isArray(result) &&
        (input.operation === 'findReferences' ||
          input.operation === 'goToDefinition' ||
          input.operation === 'goToImplementation' ||
          input.operation === 'workspaceSymbol')
      ) {
        if (input.operation === 'workspaceSymbol') {
          const symbols = result as SymbolInformation[]
          const locations = symbols.filter(s => s?.location?.uri).map(s => s.location)
          const filtered = await filterGitIgnoredLocations(locations, cwd)
          const keptUris = new Set(filtered.map(l => l.uri))
          result = symbols.filter(s => !s?.location?.uri || keptUris.has(s.location.uri))
        } else {
          const locations = (result as (Location | LocationLink)[]).map(toLocation)
          const filtered = await filterGitIgnoredLocations(locations, cwd)
          const keptUris = new Set(filtered.map(l => l.uri))
          result = (result as (Location | LocationLink)[]).filter(item => {
            const loc = toLocation(item)
            return !loc.uri || keptUris.has(loc.uri)
          })
        }
      }

      const { formatted, resultCount, fileCount } = formatResult(input.operation, result, cwd) // @429740 (wMp)
      return {
        data: {
          operation: input.operation,
          result: formatted,
          filePath: input.filePath,
          resultCount,
          fileCount,
        },
      }
    } catch (error) {
      const message = toError(error).message
      logError(
        new Error(`LSP tool request failed for ${input.operation} on ${input.filePath}: ${message}`),
      )
      return {
        data: {
          operation: input.operation,
          // @429746 (verbatim)
          result: `Error performing ${input.operation}: ${message}`,
          filePath: input.filePath,
        },
      }
    }
  },
  mapToolResultToToolResultBlockParam(output, toolUseID) {
    return { tool_use_id: toolUseID, type: 'tool_result', content: output.result }
  },
} satisfies ToolDef<InputSchema, Output>)

/**
 * Maps an LSPTool operation to its LSP method + params. Positions are converted
 * from 1-based (user-facing) to 0-based (LSP protocol). `workspaceSymbol` now
 * forwards the optional `query` field (defaulting to "") — NEW in 2.1.183; the
 * 2.1.88 mirror hardcoded an empty query.
 */
// 2.1.183: getMethodAndParams = HMp @cli_inner_pretty.js:429367-429392
function getMethodAndParams(
  input: Input,
  absolutePath: string,
): { method: string; params: unknown } {
  const uri = pathToFileURL(absolutePath).href
  const position = { line: input.line - 1, character: input.character - 1 }

  switch (input.operation) {
    case 'goToDefinition':
      return { method: 'textDocument/definition', params: { textDocument: { uri }, position } }
    case 'findReferences':
      return {
        method: 'textDocument/references',
        params: { textDocument: { uri }, position, context: { includeDeclaration: true } },
      }
    case 'hover':
      return { method: 'textDocument/hover', params: { textDocument: { uri }, position } }
    case 'documentSymbol':
      return { method: 'textDocument/documentSymbol', params: { textDocument: { uri } } }
    case 'workspaceSymbol':
      // @429383 — NEW: forward the user-supplied query (empty string => all symbols)
      return { method: 'workspace/symbol', params: { query: input.query ?? '' } }
    case 'goToImplementation':
      return { method: 'textDocument/implementation', params: { textDocument: { uri }, position } }
    case 'prepareCallHierarchy':
    case 'incomingCalls':
    case 'outgoingCalls':
      // incoming/outgoing first prepare the hierarchy item; the call request follows in call().
      return { method: 'textDocument/prepareCallHierarchy', params: { textDocument: { uri }, position } }
  }
}

// helper: R8a @429394 — countSymbols(DocumentSymbol[]) (recurses into children)
// helper: K3n @429399 — countUniqueFiles(Location[]) => Set(uri).size
// helper: vMp @429402 — uriToFilePath (file:// URI => fs path, Windows-aware, decodeURIComponent)
// helper: Mpo / formatters @ — per-operation result formatters (goToDefinition, findReferences,
//   hover, documentSymbol, workspaceSymbol, call-hierarchy) producing the `formatted` string;
//   summarized — load-bearing logic lives in formatResult (wMp @429441) and ./formatters.
export type { DocumentSymbol }
