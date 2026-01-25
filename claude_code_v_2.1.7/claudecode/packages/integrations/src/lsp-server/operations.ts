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
import { getFileSystem } from '@claudecode/platform';
import type {
  LspOperation,
  LspOperationInput,
  LspLocation,
  LspLocationLink,
  LspHoverResult,
  LspDocumentSymbol,
  LspSymbolInformation,
  LspCallHierarchyItem,
  LspIncomingCall,
  LspOutgoingCall,
  LspPosition,
  LspRange,
  LspRequest,
} from './types.js';

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
 * Original: hbA in chunks.119.mjs:2828-2846
 */
export function uriToRelativePath(uri: string, workingDir: string): string {
  if (!uri) {
    console.warn('formatUri called with undefined URI - indicates malformed LSP server response');
    return '<unknown location>';
  }
  let filePath = uri.replace(/^file:\/\//, '');
  try {
    filePath = decodeURIComponent(filePath);
  } catch (error) {
    console.warn(`Failed to decode LSP URI '${uri}': ${(error as Error).message}. Using un-decoded path: ${filePath}`);
  }
  
  if (workingDir) {
    const relPath = relative(workingDir, filePath);
    // Prefer relative path if it's shorter and doesn't escape workspace too far
    if (relPath.length < filePath.length && !relPath.startsWith('../../')) {
      return relPath;
    }
  }
  return filePath;
}

// ============================================
// Location Utilities
// ============================================

/**
 * Check if result is LocationLink (vs Location).
 * Original: qg2 in chunks.119.mjs:2874-2876
 */
export function isLocationLink(location: LspLocation | LspLocationLink): location is LspLocationLink {
  return 'targetUri' in location;
}

/**
 * Convert LocationLink to Location.
 * Original: Ug2 in chunks.119.mjs:2867-2872
 */
export function locationLinkToLocation(link: LspLocationLink): LspLocation {
  return {
    uri: link.targetUri,
    range: link.targetSelectionRange || link.targetRange,
  };
}

/**
 * Format location as relative-path:line:col.
 * Original: WK1 in chunks.119.mjs:2860-2865
 */
export function formatLocation(location: LspLocation, workingDir: string): string {
  const relativePath = uriToRelativePath(location.uri, workingDir);
  const line = location.range.start.line + 1; // 0-based → 1-based
  const char = location.range.start.character + 1;
  return `${relativePath}:${line}:${char}`;
}

/**
 * Group locations by file path.
 * Original: wg2 in chunks.119.mjs:2848-2858
 */
export function groupLocationsByFile<T extends { uri?: string; location?: LspLocation }>(
  items: T[],
  workingDir: string
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();

  for (const item of items) {
    const uri = 'uri' in item && item.uri ? item.uri : item.location?.uri;
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
): string {
  if (!result) {
    return 'No definition found. This may occur if the cursor is not on a symbol, or if the definition is in an external library not indexed by the LSP server.';
  }

  if (Array.isArray(result)) {
    const locations: LspLocation[] = result
      .map((item) => (isLocationLink(item) ? locationLinkToLocation(item) : item))
      .filter((loc): loc is LspLocation => !!loc && !!loc.uri);

    if (locations.length === 0) {
      return 'No definition found. This may occur if the cursor is not on a symbol, or if the definition is in an external library not indexed by the LSP server.';
    }

    if (locations.length === 1) {
      return `Defined in ${formatLocation(locations[0]!, workingDir)}`;
    }

    const lines = locations.map((loc) => `  ${formatLocation(loc, workingDir)}`);
    return `Found ${locations.length} definitions:\n${lines.join('\n')}`;
  }

  const location = isLocationLink(result) ? locationLinkToLocation(result) : result;
  return `Defined in ${formatLocation(location, workingDir)}`;
}

/**
 * Format Find References result.
 * Original: Lg2 in chunks.119.mjs:2898-2921
 */
export function formatFindReferencesResult(
  locations: LspLocation[] | null,
  workingDir: string
): string {
  if (!locations || locations.length === 0) {
    return 'No references found. This may occur if the symbol has no usages, or if the LSP server has not fully indexed the workspace.';
  }

  const valid = locations.filter((loc) => loc && loc.uri);

  if (valid.length === 0) {
    return 'No references found. This may occur if the symbol has no usages, or if the LSP server has not fully indexed the workspace.';
  }

  if (valid.length === 1) {
    return `Found 1 reference:\n  ${formatLocation(valid[0]!, workingDir)}`;
  }

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

  return lines.join('\n');
}

/**
 * Extract content from hover result.
 * Original: Ul5 in chunks.119.mjs:2923-2933
 */
export function extractHoverContent(
  contents: string | { kind: string; value: string } | Array<string | { kind: string; value: string }>
): string {
  if (Array.isArray(contents)) {
    return contents
      .map((c) => (typeof c === 'string' ? c : c.value))
      .join('\n\n');
  }
  if (typeof contents === 'string') return contents;
  return contents.value;
}

/**
 * Format Hover result.
 * Original: Og2 in chunks.119.mjs:2935-2946
 */
export function formatHoverResult(
  hover: LspHoverResult | null,
  _workingDir: string
): string {
  if (!hover) {
    return 'No hover information available. This may occur if the cursor is not on a symbol, or if the LSP server has not fully indexed the file.';
  }

  const content = extractHoverContent(hover.contents);

  if (hover.range) {
    const line = hover.range.start.line + 1;
    const char = hover.range.start.character + 1;
    return `Hover info at ${line}:${char}:\n\n${content}`;
  }

  return content;
}

/**
 * Flatten hierarchical document symbols.
 * Original: Mg2 in chunks.119.mjs:2979-2989
 */
function flattenDocumentSymbol(
  symbol: LspDocumentSymbol,
  depth: number = 0
): string[] {
  const result: string[] = [];
  const indent = '  '.repeat(depth);
  const kindName = symbolKindToName(symbol.kind);
  let entry = `${indent}${symbol.name} (${kindName})`;
  
  if (symbol.detail) entry += ` ${symbol.detail}`;
  const line = symbol.range.start.line + 1;
  entry += ` - Line ${line}`;
  result.push(entry);

  if (symbol.children && symbol.children.length > 0) {
    for (const child of symbol.children) {
      result.push(...flattenDocumentSymbol(child, depth + 1));
    }
  }

  return result;
}

/**
 * Format Document Symbol result.
 * Original: Rg2 in chunks.119.mjs:2991-2999
 */
export function formatDocumentSymbolResult(
  symbols: LspDocumentSymbol[] | null,
  workingDir: string
): string {
  if (!symbols || symbols.length === 0) {
    return 'No symbols found in this document. This may occur if the file is empty, not supported by the LSP server, or if the server has not fully indexed the file.';
  }

  // Handle case where workspace symbols are returned instead
  if (symbols[0] && 'location' in symbols[0]) {
    return formatWorkspaceSymbolResult(symbols as unknown as LspSymbolInformation[], workingDir);
  }

  const lines: string[] = ['Document symbols:'];
  for (const symbol of symbols) {
    lines.push(...flattenDocumentSymbol(symbol));
  }

  return lines.join('\n');
}

/**
 * Format Workspace Symbol result.
 * Original: SU0 in chunks.119.mjs:3001-3024
 */
export function formatWorkspaceSymbolResult(
  symbols: LspSymbolInformation[] | null,
  workingDir: string
): string {
  if (!symbols || symbols.length === 0) {
    return 'No symbols found in workspace. This may occur if the workspace is empty, or if the LSP server has not finished indexing the project.';
  }

  const valid = symbols.filter((sym) => sym && sym.location && sym.location.uri);

  if (valid.length === 0) {
    return 'No symbols found in workspace. This may occur if the workspace is empty, or if the LSP server has not finished indexing the project.';
  }

  const lines: string[] = [`Found ${valid.length} symbol${valid.length === 1 ? '' : 's'} in workspace:`];
  const groupedByFile = groupLocationsByFile(valid, workingDir);

  for (const [filePath, fileSymbols] of groupedByFile) {
    lines.push(`\n${filePath}:`);
    for (const symbol of fileSymbols) {
      const kindName = symbolKindToName(symbol.kind);
      const line = symbol.location.range.start.line + 1;
      let entry = `  ${symbol.name} (${kindName}) - Line ${line}`;
      if (symbol.containerName) {
        entry += ` in ${symbol.containerName}`;
      }
      lines.push(entry);
    }
  }

  return lines.join('\n');
}

/**
 * Format single Call Hierarchy Item.
 * Original: Ng2 in chunks.119.mjs:3026-3036
 */
export function formatCallHierarchyItem(item: LspCallHierarchyItem, workingDir: string): string {
  if (!item.uri) {
    console.warn('formatCallHierarchyItem: CallHierarchyItem has undefined URI');
    return `${item.name} (${symbolKindToName(item.kind)}) - <unknown location>`;
  }
  const relPath = uriToRelativePath(item.uri, workingDir);
  const line = item.range.start.line + 1;
  const kindName = symbolKindToName(item.kind);
  let result = `${item.name} (${kindName}) - ${relPath}:${line}`;
  if (item.detail) result += ` [${item.detail}]`;
  return result;
}

/**
 * Format Prepare Call Hierarchy result.
 * Original: _g2 in chunks.119.mjs:3038-3045
 */
export function formatPrepareCallHierarchyResult(
  items: LspCallHierarchyItem[] | null,
  workingDir: string
): string {
  if (!items || items.length === 0) {
    return 'No call hierarchy item found at this position';
  }
  if (items.length === 1) {
    return `Call hierarchy item: ${formatCallHierarchyItem(items[0]!, workingDir)}`;
  }
  const lines: string[] = [`Found ${items.length} call hierarchy items:`];
  for (const item of items) {
    lines.push(`  ${formatCallHierarchyItem(item, workingDir)}`);
  }
  return lines.join('\n');
}

/**
 * Format Incoming Calls result.
 * Original: jg2 in chunks.119.mjs:3047-3080
 */
export function formatIncomingCallsResult(
  calls: LspIncomingCall[] | null,
  workingDir: string
): string {
  if (!calls || calls.length === 0) {
    return 'No incoming calls found (nothing calls this function)';
  }

  const lines: string[] = [`Found ${calls.length} incoming call${calls.length === 1 ? '' : 's'}:`];
  const groupedByFile = new Map<string, LspIncomingCall[]>();

  for (const call of calls) {
    if (!call.from) {
      console.warn('formatIncomingCallsResult: CallHierarchyIncomingCall has undefined from field');
      continue;
    }
    const relPath = uriToRelativePath(call.from.uri, workingDir);
    const existing = groupedByFile.get(relPath) || [];
    existing.push(call);
    groupedByFile.set(relPath, existing);
  }

  for (const [filePath, fileCalls] of groupedByFile) {
    lines.push(`\n${filePath}:`);
    for (const call of fileCalls) {
      const from = call.from;
      const kindName = symbolKindToName(from.kind);
      const line = from.range.start.line + 1;
      let entry = `  ${from.name} (${kindName}) - Line ${line}`;
      if (call.fromRanges && call.fromRanges.length > 0) {
        const ranges = call.fromRanges.map((r) => `${r.start.line + 1}:${r.start.character + 1}`).join(', ');
        entry += ` [calls at: ${ranges}]`;
      }
      lines.push(entry);
    }
  }

  return lines.join('\n');
}

/**
 * Format Outgoing Calls result.
 * Original: Tg2 in chunks.119.mjs:3082-3115
 */
export function formatOutgoingCallsResult(
  calls: LspOutgoingCall[] | null,
  workingDir: string
): string {
  if (!calls || calls.length === 0) {
    return 'No outgoing calls found (this function calls nothing)';
  }

  const lines: string[] = [`Found ${calls.length} outgoing call${calls.length === 1 ? '' : 's'}:`];
  const groupedByFile = new Map<string, LspOutgoingCall[]>();

  for (const call of calls) {
    if (!call.to) {
      console.warn('formatOutgoingCallsResult: CallHierarchyOutgoingCall has undefined to field');
      continue;
    }
    const relPath = uriToRelativePath(call.to.uri, workingDir);
    const existing = groupedByFile.get(relPath) || [];
    existing.push(call);
    groupedByFile.set(relPath, existing);
  }

  for (const [filePath, fileCalls] of groupedByFile) {
    lines.push(`\n${filePath}:`);
    for (const call of fileCalls) {
      const to = call.to;
      const kindName = symbolKindToName(to.kind);
      const line = to.range.start.line + 1;
      let entry = `  ${to.name} (${kindName}) - Line ${line}`;
      if (call.fromRanges && call.fromRanges.length > 0) {
        const ranges = call.fromRanges.map((r) => `${r.start.line + 1}:${r.start.character + 1}`).join(', ');
        entry += ` [called from: ${ranges}]`;
      }
      lines.push(entry);
    }
  }

  return lines.join('\n');
}

/**
 * Extract symbol name at position for display.
 * Original: xg2 in chunks.119.mjs:3143-3172
 */
export function extractSymbolAtPosition(
  filePath: string,
  line: number,
  character: number
): string | null {
  try {
    const fs = getFileSystem();
    if (!fs.existsSync(filePath)) return null;

    const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const lines = content.split('\n');
    if (line < 0 || line >= lines.length) return null;

    const lineContent = lines[line];
    if (!lineContent || character < 0 || character >= lineContent.length) return null;

    // Match identifiers OR operators
    const symbolRegex = /[\w$'!]+|[+\-*/%&|^~<>=]+/g;
    let match;

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
  } catch (error) {
    return null;
  }
}

// ============================================
// Main Result Formatter
// ============================================

/**
 * Count total results including children for document symbols.
 * Original: dg2 in chunks.119.mjs:3410-3415
 */
function countDocumentSymbols(symbols: LspDocumentSymbol[]): number {
  let count = symbols.length;
  for (const symbol of symbols) {
    if (symbol.children && symbol.children.length > 0) {
      count += countDocumentSymbols(symbol.children);
    }
  }
  return count;
}

/**
 * Count unique files in a list of locations.
 * Original: KK1 in chunks.119.mjs:3417-3419
 */
function countUniqueFiles(locations: LspLocation[]): number {
  return new Set(locations.map((l) => l.uri)).size;
}

/**
 * Format LSP result based on operation type.
 * Original: jl5 in chunks.119.mjs:3433-3518
 */
export function formatLspResult(
  operation: LspOperation,
  result: unknown,
  workingDir: string
): { formatted: string; resultCount: number; fileCount: number } {
  switch (operation) {
    case 'goToDefinition':
    case 'goToImplementation': {
      const normalizedResult = (Array.isArray(result) ? result : result ? [result] : []) as Array<LspLocation | LspLocationLink>;
      const locations = normalizedResult.map((item) => (isLocationLink(item) ? locationLinkToLocation(item) : item));
      
      const invalid = locations.filter((l) => !l || !l.uri);
      if (invalid.length > 0) {
        console.error(`LSP server returned ${invalid.length} location(s) with undefined URI for ${operation} on ${workingDir}.`);
      }
      
      const valid = locations.filter((l) => l && l.uri);
      const formatted = operation === 'goToDefinition' 
        ? formatGoToDefinitionResult(result as any, workingDir)
        : formatGoToDefinitionResult(result as any, workingDir).replace('Defined in', 'Implementation at').replace('definitions', 'implementations');

      return {
        formatted,
        resultCount: valid.length,
        fileCount: countUniqueFiles(valid),
      };
    }

    case 'findReferences': {
      const locations = (result || []) as LspLocation[];
      const invalid = locations.filter((l) => !l || !l.uri);
      if (invalid.length > 0) {
        console.error(`LSP server returned ${invalid.length} location(s) with undefined URI for findReferences on ${workingDir}.`);
      }
      
      const valid = locations.filter((l) => l && l.uri);
      return {
        formatted: formatFindReferencesResult(result as any, workingDir),
        resultCount: valid.length,
        fileCount: countUniqueFiles(valid),
      };
    }

    case 'hover':
      return {
        formatted: formatHoverResult(result as any, workingDir),
        resultCount: result ? 1 : 0,
        fileCount: result ? 1 : 0,
      };

    case 'documentSymbol': {
      const symbols = (result || []) as LspDocumentSymbol[];
      // Check if it's actually LspSymbolInformation (workspace symbols)
      if (symbols.length > 0 && 'location' in (symbols[0] as any)) {
        return formatLspResult('workspaceSymbol', result, workingDir);
      }
      return {
        formatted: formatDocumentSymbolResult(symbols, workingDir),
        resultCount: symbols.length > 0 ? countDocumentSymbols(symbols) : 0,
        fileCount: symbols.length > 0 ? 1 : 0,
      };
    }

    case 'workspaceSymbol': {
      const symbols = (result || []) as LspSymbolInformation[];
      const invalid = symbols.filter((s) => !s || !s.location || !s.location.uri);
      if (invalid.length > 0) {
        console.error(`LSP server returned ${invalid.length} symbol(s) with undefined location URI for workspaceSymbol on ${workingDir}.`);
      }
      
      const valid = symbols.filter((s) => s && s.location && s.location.uri);
      const validLocations = valid.map((s) => s.location);
      return {
        formatted: formatWorkspaceSymbolResult(result as any, workingDir),
        resultCount: valid.length,
        fileCount: countUniqueFiles(validLocations),
      };
    }

    case 'prepareCallHierarchy': {
      const items = (result || []) as LspCallHierarchyItem[];
      const validUris = items.map((i) => i.uri).filter((u) => !!u);
      return {
        formatted: formatPrepareCallHierarchyResult(items, workingDir),
        resultCount: items.length,
        fileCount: new Set(validUris).size,
      };
    }

    case 'incomingCalls': {
      const calls = (result || []) as LspIncomingCall[];
      const validUris = calls.map((c) => c.from?.uri).filter((u) => !!u);
      return {
        formatted: formatIncomingCallsResult(calls, workingDir),
        resultCount: calls.length,
        fileCount: new Set(validUris).size,
      };
    }

    case 'outgoingCalls': {
      const calls = (result || []) as LspOutgoingCall[];
      const validUris = calls.map((c) => c.to?.uri).filter((u) => !!u);
      return {
        formatted: formatOutgoingCallsResult(calls, workingDir),
        resultCount: calls.length,
        fileCount: new Set(validUris).size,
      };
    }

    default:
      return {
        formatted: `Unknown operation: ${operation}`,
        resultCount: 0,
        fileCount: 0,
      };
  }
}


// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出以避免 TS2323/TS2484。
