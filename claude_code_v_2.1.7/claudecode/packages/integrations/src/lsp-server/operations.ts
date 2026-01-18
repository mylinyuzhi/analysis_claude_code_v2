/**
 * @claudecode/integrations - LSP Operations
 *
 * High-level LSP operations for code intelligence features.
 * Reconstructed from chunks.119.mjs, chunks.120.mjs
 *
 * Key symbols:
 * - Rl5 → buildLspRequest
 * - jl5 → formatLspResult
 * - PU0 → formatGoToDefinitionResult
 * - Lg2 → formatFindReferencesResult
 * - Og2 → formatHoverResult
 * - Rg2 → formatDocumentSymbolResult
 * - SU0 → formatWorkspaceSymbolResult
 * - rHA → symbolKindToName
 */

import { relative } from 'path';
import { pathToFileURL } from 'url';

// ============================================
// Constants
// ============================================

/**
 * All supported LSP operations.
 */
export const LSP_OPERATIONS = [
  'goToDefinition',
  'findReferences',
  'hover',
  'documentSymbol',
  'workspaceSymbol',
  'goToImplementation',
  'prepareCallHierarchy',
  'incomingCalls',
  'outgoingCalls',
] as const;

export type LspOperation = (typeof LSP_OPERATIONS)[number];

// ============================================
// Types
// ============================================

/**
 * LSP operation input.
 */
export interface LspOperationInput {
  operation: LspOperation;
  filePath: string;
  line: number;     // 1-based
  character: number; // 1-based
}

/**
 * LSP operation result.
 */
export interface LspOperationResult {
  operation: LspOperation;
  result: string;
  filePath: string;
  resultCount?: number;
  fileCount?: number;
}

/**
 * LSP request with method and params.
 */
export interface LspRequest {
  method: string;
  params: unknown;
}

/**
 * LSP Position (0-based).
 */
export interface LspPosition {
  line: number;
  character: number;
}

/**
 * LSP Range.
 */
export interface LspRange {
  start: LspPosition;
  end: LspPosition;
}

/**
 * LSP Location.
 */
export interface LspLocation {
  uri: string;
  range: LspRange;
}

/**
 * LSP LocationLink (used by some definition responses).
 */
export interface LspLocationLink {
  originSelectionRange?: LspRange;
  targetUri: string;
  targetRange: LspRange;
  targetSelectionRange: LspRange;
}

/**
 * LSP Hover result.
 */
export interface LspHoverResult {
  contents: string | { kind: string; value: string } | Array<string | { kind: string; value: string }>;
  range?: LspRange;
}

/**
 * LSP Document Symbol.
 */
export interface LspDocumentSymbol {
  name: string;
  kind: number;
  range: LspRange;
  selectionRange: LspRange;
  children?: LspDocumentSymbol[];
}

/**
 * LSP Symbol Information (workspace symbols).
 */
export interface LspSymbolInformation {
  name: string;
  kind: number;
  location: LspLocation;
  containerName?: string;
}

/**
 * LSP Call Hierarchy Item.
 */
export interface LspCallHierarchyItem {
  name: string;
  kind: number;
  uri: string;
  range: LspRange;
  selectionRange: LspRange;
  detail?: string;
}

/**
 * LSP Incoming Call.
 */
export interface LspIncomingCall {
  from: LspCallHierarchyItem;
  fromRanges: LspRange[];
}

/**
 * LSP Outgoing Call.
 */
export interface LspOutgoingCall {
  to: LspCallHierarchyItem;
  fromRanges: LspRange[];
}

// ============================================
// Symbol Kind Mapping
// ============================================

/**
 * Map LSP SymbolKind to human-readable name.
 * Original: rHA in chunks.119.mjs:2948-2977
 */
export function symbolKindToName(kind: number): string {
  const kindMap: Record<number, string> = {
    1: 'File',
    2: 'Module',
    3: 'Namespace',
    4: 'Package',
    5: 'Class',
    6: 'Method',
    7: 'Property',
    8: 'Field',
    9: 'Constructor',
    10: 'Enum',
    11: 'Interface',
    12: 'Function',
    13: 'Variable',
    14: 'Constant',
    15: 'String',
    16: 'Number',
    17: 'Boolean',
    18: 'Array',
    19: 'Object',
    20: 'Key',
    21: 'Null',
    22: 'EnumMember',
    23: 'Struct',
    24: 'Event',
    25: 'Operator',
    26: 'TypeParameter',
  };
  return kindMap[kind] || 'Unknown';
}

// ============================================
// Path/URI Utilities
// ============================================

/**
 * Convert file path to file:// URI.
 * Original: Ll5 in chunks.119.mjs
 */
export function pathToFileUri(filePath: string): URL {
  return pathToFileURL(filePath);
}

/**
 * Convert file:// URI to relative path.
 * Original: hbA in chunks.119.mjs
 */
export function uriToRelativePath(uri: string, workingDir: string): string {
  const filePath = uri.replace('file://', '');
  return relative(workingDir, filePath);
}

// ============================================
// Location Utilities
// ============================================

/**
 * Check if result is LocationLink (vs Location).
 * Original: qg2 in chunks.119.mjs
 */
export function isLocationLink(location: LspLocation | LspLocationLink): location is LspLocationLink {
  return 'targetUri' in location;
}

/**
 * Convert LocationLink to Location.
 * Original: Ug2 in chunks.119.mjs
 */
export function locationLinkToLocation(link: LspLocationLink): LspLocation {
  return {
    uri: link.targetUri,
    range: link.targetSelectionRange,
  };
}

/**
 * Format location as relative-path:line:col.
 * Original: WK1 in chunks.119.mjs
 */
export function formatLocation(location: LspLocation, workingDir: string): string {
  const relativePath = uriToRelativePath(location.uri, workingDir);
  const line = location.range.start.line + 1; // 0-based → 1-based
  const char = location.range.start.character + 1;
  return `${relativePath}:${line}:${char}`;
}

/**
 * Group locations by file path.
 * Original: wg2 in chunks.119.mjs
 */
export function groupLocationsByFile<T extends { uri?: string; location?: LspLocation }>(
  items: T[],
  workingDir: string
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();

  for (const item of items) {
    const uri = 'location' in item && item.location ? item.location.uri : (item as { uri?: string }).uri;
    if (!uri) continue;

    const relativePath = uriToRelativePath(uri, workingDir);
    const existing = grouped.get(relativePath) || [];
    existing.push(item);
    grouped.set(relativePath, existing);
  }

  return grouped;
}

// ============================================
// Request Builder
// ============================================

/**
 * Build LSP request from operation input.
 * Original: Rl5 in chunks.119.mjs:3320-3407
 *
 * Key insight: Position conversion from 1-based (user) to 0-based (LSP).
 */
export function buildLspRequest(input: LspOperationInput, resolvedPath: string): LspRequest {
  const fileUri = pathToFileUri(resolvedPath).href;
  const position: LspPosition = {
    line: input.line - 1,     // 1-based → 0-based
    character: input.character - 1,
  };

  switch (input.operation) {
    case 'goToDefinition':
      return {
        method: 'textDocument/definition',
        params: { textDocument: { uri: fileUri }, position },
      };

    case 'findReferences':
      return {
        method: 'textDocument/references',
        params: {
          textDocument: { uri: fileUri },
          position,
          context: { includeDeclaration: true },
        },
      };

    case 'hover':
      return {
        method: 'textDocument/hover',
        params: { textDocument: { uri: fileUri }, position },
      };

    case 'documentSymbol':
      return {
        method: 'textDocument/documentSymbol',
        params: { textDocument: { uri: fileUri } },
      };

    case 'workspaceSymbol':
      return {
        method: 'workspace/symbol',
        params: { query: '' }, // Empty query = all symbols
      };

    case 'goToImplementation':
      return {
        method: 'textDocument/implementation',
        params: { textDocument: { uri: fileUri }, position },
      };

    case 'prepareCallHierarchy':
    case 'incomingCalls':
    case 'outgoingCalls':
      // All start with prepareCallHierarchy (additional call made in handler)
      return {
        method: 'textDocument/prepareCallHierarchy',
        params: { textDocument: { uri: fileUri }, position },
      };

    default:
      throw new Error(`Unknown LSP operation: ${input.operation}`);
  }
}

// ============================================
// Result Formatters
// ============================================

/**
 * Format Go To Definition result.
 * Original: PU0 in chunks.119.mjs:2878-2896
 */
export function formatGoToDefinitionResult(
  result: LspLocation | LspLocationLink | Array<LspLocation | LspLocationLink> | null,
  workingDir: string
): { formatted: string; resultCount: number; fileCount: number } {
  if (!result) {
    return {
      formatted: 'No definition found. This may occur if the cursor is not on a symbol, or if the definition is in an external library not indexed by the LSP server.',
      resultCount: 0,
      fileCount: 0,
    };
  }

  if (Array.isArray(result)) {
    // Normalize LocationLink to Location format
    const locations: LspLocation[] = result
      .map((item) => (isLocationLink(item) ? locationLinkToLocation(item) : item))
      .filter((loc): loc is LspLocation => !!loc && !!loc.uri);

    if (locations.length === 0) {
      return { formatted: 'No definition found.', resultCount: 0, fileCount: 0 };
    }

    if (locations.length === 1) {
      return {
        formatted: `Defined in ${formatLocation(locations[0], workingDir)}`,
        resultCount: 1,
        fileCount: 1,
      };
    }

    const fileSet = new Set(locations.map((loc) => loc.uri));
    const lines = locations.map((loc) => `  ${formatLocation(loc, workingDir)}`);
    return {
      formatted: `Found ${locations.length} definitions:\n${lines.join('\n')}`,
      resultCount: locations.length,
      fileCount: fileSet.size,
    };
  }

  // Single location
  const location = isLocationLink(result) ? locationLinkToLocation(result) : result;
  return {
    formatted: `Defined in ${formatLocation(location, workingDir)}`,
    resultCount: 1,
    fileCount: 1,
  };
}

/**
 * Format Find References result.
 * Original: Lg2 in chunks.119.mjs:2898-2921
 */
export function formatFindReferencesResult(
  locations: LspLocation[] | null,
  workingDir: string
): { formatted: string; resultCount: number; fileCount: number } {
  if (!locations || locations.length === 0) {
    return {
      formatted: 'No references found. This may occur if the symbol has no usages, or if the LSP server has not fully indexed the workspace.',
      resultCount: 0,
      fileCount: 0,
    };
  }

  const valid = locations.filter((loc) => loc && loc.uri);

  if (valid.length === 0) {
    return { formatted: 'No references found.', resultCount: 0, fileCount: 0 };
  }

  if (valid.length === 1) {
    return {
      formatted: `Found 1 reference:\n  ${formatLocation(valid[0], workingDir)}`,
      resultCount: 1,
      fileCount: 1,
    };
  }

  // Group by file
  const groupedByFile = groupLocationsByFile(valid, workingDir);
  const lines: string[] = [`Found ${valid.length} references across ${groupedByFile.size} files:`];

  for (const [filePath, fileLocations] of groupedByFile) {
    lines.push(`\n${filePath}:`);
    for (const location of fileLocations) {
      const line = location.range.start.line + 1;
      const char = location.range.start.character + 1;
      lines.push(`  Line ${line}:${char}`);
    }
  }

  return {
    formatted: lines.join('\n'),
    resultCount: valid.length,
    fileCount: groupedByFile.size,
  };
}

/**
 * Extract content from hover result.
 * Original: Ul5 in chunks.119.mjs
 */
export function extractHoverContent(
  contents: string | { kind: string; value: string } | Array<string | { kind: string; value: string }>
): string {
  if (typeof contents === 'string') {
    return contents;
  }

  if (Array.isArray(contents)) {
    return contents
      .map((c) => (typeof c === 'string' ? c : c.value))
      .join('\n\n');
  }

  return contents.value;
}

/**
 * Format Hover result.
 * Original: Og2 in chunks.119.mjs:2935-2946
 */
export function formatHoverResult(
  hover: LspHoverResult | null,
  _workingDir: string
): { formatted: string; resultCount: number; fileCount: number } {
  if (!hover) {
    return {
      formatted: 'No hover information available. This may occur if the cursor is not on a symbol, or if the LSP server has not fully indexed the file.',
      resultCount: 0,
      fileCount: 0,
    };
  }

  const content = extractHoverContent(hover.contents);

  if (hover.range) {
    const line = hover.range.start.line + 1;
    const char = hover.range.start.character + 1;
    return {
      formatted: `Hover info at ${line}:${char}:\n\n${content}`,
      resultCount: 1,
      fileCount: 1,
    };
  }

  return { formatted: content, resultCount: 1, fileCount: 1 };
}

/**
 * Flatten hierarchical document symbols.
 * Original: Mg2 in chunks.119.mjs:2979-2991
 */
function flattenDocumentSymbol(
  symbol: LspDocumentSymbol,
  depth: number = 0
): Array<{ name: string; kind: number; range: LspRange; depth: number }> {
  const result: Array<{ name: string; kind: number; range: LspRange; depth: number }> = [];

  result.push({
    name: symbol.name,
    kind: symbol.kind,
    range: symbol.range,
    depth,
  });

  if (symbol.children) {
    for (const child of symbol.children) {
      result.push(...flattenDocumentSymbol(child, depth + 1));
    }
  }

  return result;
}

/**
 * Format Document Symbol result.
 * Original: Rg2 in chunks.119.mjs:2993-3003
 */
export function formatDocumentSymbolResult(
  symbols: LspDocumentSymbol[] | null,
  _workingDir: string
): { formatted: string; resultCount: number; fileCount: number } {
  if (!symbols || symbols.length === 0) {
    return {
      formatted: 'No symbols found in this document.',
      resultCount: 0,
      fileCount: 0,
    };
  }

  // Flatten hierarchical symbols
  const flatSymbols: Array<{ name: string; kind: number; range: LspRange; depth: number }> = [];
  for (const symbol of symbols) {
    flatSymbols.push(...flattenDocumentSymbol(symbol));
  }

  // Format each symbol with indentation based on depth
  const lines: string[] = [];
  for (const { name, kind, range, depth } of flatSymbols) {
    const line = range.start.line + 1;
    const kindName = symbolKindToName(kind);
    const indent = '  '.repeat(depth);
    lines.push(`${indent}${kindName}: ${name} (line ${line})`);
  }

  return {
    formatted: lines.join('\n'),
    resultCount: flatSymbols.length,
    fileCount: 1,
  };
}

/**
 * Format Workspace Symbol result.
 * Original: SU0 in chunks.119.mjs:3001-3023
 */
export function formatWorkspaceSymbolResult(
  symbols: LspSymbolInformation[] | null,
  workingDir: string
): { formatted: string; resultCount: number; fileCount: number } {
  if (!symbols || symbols.length === 0) {
    return {
      formatted: 'No symbols found in workspace. This may occur if the workspace is empty, or if the LSP server has not finished indexing the project.',
      resultCount: 0,
      fileCount: 0,
    };
  }

  const valid = symbols.filter((sym) => sym && sym.location && sym.location.uri);

  if (valid.length === 0) {
    return { formatted: 'No symbols found in workspace.', resultCount: 0, fileCount: 0 };
  }

  // Group symbols by file
  const groupedByFile = groupLocationsByFile(valid, workingDir);

  const lines: string[] = [`Found ${valid.length} symbol${valid.length === 1 ? '' : 's'} in workspace:`];

  for (const [filePath, fileSymbols] of groupedByFile) {
    lines.push(`\n${filePath}:`);
    for (const symbol of fileSymbols) {
      const kindName = symbolKindToName(symbol.kind);
      const line = symbol.location.range.start.line + 1;
      let entry = `  ${symbol.name} (${kindName}) - Line ${line}`;
      // Include container name if present (e.g., "method in ClassName")
      if (symbol.containerName) {
        entry += ` in ${symbol.containerName}`;
      }
      lines.push(entry);
    }
  }

  return {
    formatted: lines.join('\n'),
    resultCount: valid.length,
    fileCount: groupedByFile.size,
  };
}

/**
 * Format Go To Implementation result.
 * Uses same format as Go To Definition.
 */
export function formatGoToImplementationResult(
  result: LspLocation | LspLocationLink | Array<LspLocation | LspLocationLink> | null,
  workingDir: string
): { formatted: string; resultCount: number; fileCount: number } {
  if (!result) {
    return {
      formatted: 'No implementation found. This may occur if the symbol has no implementations, or if it is already a concrete implementation.',
      resultCount: 0,
      fileCount: 0,
    };
  }

  // Reuse definition formatter with different message prefix
  const defResult = formatGoToDefinitionResult(result, workingDir);
  return {
    ...defResult,
    formatted: defResult.formatted.replace('Defined in', 'Implementation at').replace('definitions', 'implementations'),
  };
}

/**
 * Format Prepare Call Hierarchy result.
 * Original: _g2 in chunks.119.mjs:3038-3046
 */
export function formatPrepareCallHierarchyResult(
  items: LspCallHierarchyItem[] | null,
  workingDir: string
): { formatted: string; resultCount: number; fileCount: number } {
  if (!items || items.length === 0) {
    return {
      formatted: 'No call hierarchy item found at this location.',
      resultCount: 0,
      fileCount: 0,
    };
  }

  const item = items[0];
  const relativePath = uriToRelativePath(item.uri, workingDir);
  const line = item.range.start.line + 1;
  const kindName = symbolKindToName(item.kind);

  return {
    formatted: `Call hierarchy item: ${item.name} (${kindName}) at ${relativePath}:${line}`,
    resultCount: 1,
    fileCount: 1,
  };
}

/**
 * Format Incoming Calls result.
 * Original: jg2 in chunks.119.mjs:3048-3065
 */
export function formatIncomingCallsResult(
  calls: LspIncomingCall[] | null,
  workingDir: string
): { formatted: string; resultCount: number; fileCount: number } {
  if (!calls || calls.length === 0) {
    return {
      formatted: 'No incoming calls found (no functions call this location).',
      resultCount: 0,
      fileCount: 0,
    };
  }

  const fileSet = new Set<string>();
  const lines: string[] = [`Found ${calls.length} incoming call(s):`];

  for (const call of calls) {
    const caller = call.from;
    const relativePath = uriToRelativePath(caller.uri, workingDir);
    fileSet.add(caller.uri);
    const line = caller.range.start.line + 1;
    const kindName = symbolKindToName(caller.kind);
    lines.push(`  ${kindName}: ${caller.name} at ${relativePath}:${line}`);

    // Show specific call sites within the caller
    if (call.fromRanges && call.fromRanges.length > 0) {
      for (const range of call.fromRanges) {
        const callLine = range.start.line + 1;
        lines.push(`    - call at line ${callLine}`);
      }
    }
  }

  return {
    formatted: lines.join('\n'),
    resultCount: calls.length,
    fileCount: fileSet.size,
  };
}

/**
 * Format Outgoing Calls result.
 * Original: Tg2 in chunks.119.mjs:3067-3084
 */
export function formatOutgoingCallsResult(
  calls: LspOutgoingCall[] | null,
  workingDir: string
): { formatted: string; resultCount: number; fileCount: number } {
  if (!calls || calls.length === 0) {
    return {
      formatted: "No outgoing calls found (this location doesn't call other functions).",
      resultCount: 0,
      fileCount: 0,
    };
  }

  const fileSet = new Set<string>();
  const lines: string[] = [`Found ${calls.length} outgoing call(s):`];

  for (const call of calls) {
    const callee = call.to;
    const relativePath = uriToRelativePath(callee.uri, workingDir);
    fileSet.add(callee.uri);
    const line = callee.range.start.line + 1;
    const kindName = symbolKindToName(callee.kind);
    lines.push(`  ${kindName}: ${callee.name} at ${relativePath}:${line}`);

    // Show specific call sites (where the call is made)
    if (call.fromRanges && call.fromRanges.length > 0) {
      for (const range of call.fromRanges) {
        const callLine = range.start.line + 1;
        lines.push(`    - call at line ${callLine}`);
      }
    }
  }

  return {
    formatted: lines.join('\n'),
    resultCount: calls.length,
    fileCount: fileSet.size,
  };
}

// ============================================
// Main Result Formatter
// ============================================

/**
 * Format LSP result based on operation type.
 * Original: jl5 in chunks.119.mjs
 */
export function formatLspResult(
  operation: LspOperation,
  result: unknown,
  workingDir: string
): { formatted: string; resultCount: number; fileCount: number } {
  switch (operation) {
    case 'goToDefinition':
      return formatGoToDefinitionResult(
        result as LspLocation | LspLocationLink | Array<LspLocation | LspLocationLink> | null,
        workingDir
      );

    case 'findReferences':
      return formatFindReferencesResult(result as LspLocation[] | null, workingDir);

    case 'hover':
      return formatHoverResult(result as LspHoverResult | null, workingDir);

    case 'documentSymbol':
      return formatDocumentSymbolResult(result as LspDocumentSymbol[] | null, workingDir);

    case 'workspaceSymbol':
      return formatWorkspaceSymbolResult(result as LspSymbolInformation[] | null, workingDir);

    case 'goToImplementation':
      return formatGoToImplementationResult(
        result as LspLocation | LspLocationLink | Array<LspLocation | LspLocationLink> | null,
        workingDir
      );

    case 'prepareCallHierarchy':
      return formatPrepareCallHierarchyResult(result as LspCallHierarchyItem[] | null, workingDir);

    case 'incomingCalls':
      return formatIncomingCallsResult(result as LspIncomingCall[] | null, workingDir);

    case 'outgoingCalls':
      return formatOutgoingCallsResult(result as LspOutgoingCall[] | null, workingDir);

    default:
      return {
        formatted: `Unknown operation: ${operation}`,
        resultCount: 0,
        fileCount: 0,
      };
  }
}

// ============================================
// Symbol Extraction for UI
// ============================================

/**
 * Extract symbol at cursor position for UI display.
 * Original: xg2 in chunks.119.mjs:3143-3172
 *
 * Works independently of LSP - reads file directly and uses regex.
 */
export function extractSymbolAtPosition(
  fileContent: string,
  line: number,    // 0-based
  character: number // 0-based
): string | null {
  try {
    const lines = fileContent.split('\n');

    if (line < 0 || line >= lines.length) return null;

    const lineContent = lines[line];
    if (!lineContent || character < 0 || character >= lineContent.length) return null;

    // Match identifiers OR operators
    const symbolRegex = /[\w$'!]+|[+\-*/%&|^~<>=]+/g;
    let match: RegExpExecArray | null;

    while ((match = symbolRegex.exec(lineContent)) !== null) {
      const startIndex = match.index;
      const endIndex = startIndex + match[0].length;

      if (character >= startIndex && character < endIndex) {
        const symbol = match[0];
        // Truncate long symbols to 30 chars
        return symbol.length > 30 ? symbol.slice(0, 27) + '...' : symbol;
      }
    }

    return null;
  } catch {
    return null;
  }
}

// ============================================
// Export
// ============================================

export {
  LSP_OPERATIONS,
  buildLspRequest,
  formatLspResult,
  symbolKindToName,
  pathToFileUri,
  uriToRelativePath,
  isLocationLink,
  locationLinkToLocation,
  formatLocation,
  groupLocationsByFile,
  formatGoToDefinitionResult,
  formatFindReferencesResult,
  formatHoverResult,
  formatDocumentSymbolResult,
  formatWorkspaceSymbolResult,
  formatGoToImplementationResult,
  formatPrepareCallHierarchyResult,
  formatIncomingCallsResult,
  formatOutgoingCallsResult,
  extractHoverContent,
  extractSymbolAtPosition,
};
