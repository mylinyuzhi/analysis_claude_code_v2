/**
 * @claudecode/integrations - LSP Operations
 *
 * Handles mapping of abstract LSP operations (like "goToDefinition") to specific
 * LSP protocol requests, and formatting the results for display.
 * Reconstructed from chunks.119.mjs
 */

import * as path from 'path';
import {
  type LspOperation,
  type LspOperationInput,
  type LspRequest,
  type LspLocation,
  type LspLocationLink,
  type LspRange,
  type LspDocumentSymbol,
  type LspSymbolInformation,
  type LspCallHierarchyItem,
  type LspIncomingCall,
  type LspOutgoingCall,
  type LspHoverResult,
  LSP_CONSTANTS
} from './types';

// ============================================
// Helpers
// ============================================

/**
 * Converts a file path to a file URI.
 * Original: Ll5 in chunks.119.mjs:~3320
 */
export function pathToFileUri(filePath: string): string {
  // Simple implementation, in reality might need more robust handling
  let resolved = path.resolve(filePath);
  // Windows handling if needed, but we assume posix for now or node handles it
  if (path.sep === '\\') {
    resolved = resolved.replace(/\\/g, '/');
  }
  if (!resolved.startsWith('/')) {
    resolved = '/' + resolved;
  }
  return `file://${encodeURI(resolved).replace(/#/g, '%23')}`;
}

/**
 * Formats a URI for display, making it relative to CWD if possible.
 * Original: hbA in chunks.119.mjs:353700
 */
export function uriToRelativePath(uri: string, cwd?: string): string {
  if (!uri) {
    console.warn('formatUri called with undefined URI');
    return '<unknown location>';
  }

  let filePath = uri.replace(/^file:\/\//, '');
  try {
    filePath = decodeURIComponent(filePath);
  } catch (err: any) {
    console.warn(`Failed to decode LSP URI '${uri}': ${err.message}. Using un-decoded path: ${filePath}`);
  }

  if (cwd) {
    const relative = path.relative(cwd, filePath);
    // Use relative path if it's shorter and within the CWD (doesn't start with ..)
    if (relative.length < filePath.length && !relative.startsWith('..')) {
      return relative;
    }
  }
  return filePath;
}

/**
 * Groups locations by file URI.
 * Original: wg2 in chunks.119.mjs:353720
 */
function groupLocationsByFile(locations: Array<LspLocation | LspSymbolInformation>, cwd?: string): Map<string, Array<LspLocation | LspSymbolInformation>> {
  const groups = new Map<string, Array<LspLocation | LspSymbolInformation>>();
  
  for (const loc of locations) {
    const uri = 'uri' in loc ? loc.uri : loc.location.uri;
    const formattedPath = uriToRelativePath(uri, cwd);
    
    if (!groups.has(formattedPath)) {
      groups.set(formattedPath, []);
    }
    groups.get(formattedPath)!.push(loc);
  }
  return groups;
}

/**
 * Formats a location string (file:line:char).
 * Original: WK1 in chunks.119.mjs:353732
 */
export function formatLocation(loc: { uri: string; range: LspRange }, cwd?: string): string {
  const filePath = uriToRelativePath(loc.uri, cwd);
  const line = loc.range.start.line + 1;
  const char = loc.range.start.character + 1;
  return `${filePath}:${line}:${char}`;
}

/**
 * Normalizes LocationLink to Location.
 * Original: Ug2/mg2 in chunks.119.mjs:353739
 */
function normalizeLocation(loc: LspLocation | LspLocationLink): { uri: string; range: LspRange } {
  if ('targetUri' in loc) {
    return {
      uri: loc.targetUri,
      range: loc.targetSelectionRange || loc.targetRange
    };
  }
  return loc;
}

/**
 * Counts unique URIs in a list of items.
 * Original: KK1 in chunks.119.mjs:354288
 */
function countUniqueFiles(items: Array<{ uri?: string; location?: { uri: string } }>): number {
  const uris = new Set<string>();
  for (const item of items) {
    if (item.uri) uris.add(item.uri);
    else if (item.location && item.location.uri) uris.add(item.location.uri);
  }
  return uris.size;
}

/**
 * Maps symbol kind number to string name.
 * Original: rHA in chunks.119.mjs:353820
 */
export function symbolKindToName(kind: number): string {
  const kinds: Record<number, string> = {
    1: "File", 2: "Module", 3: "Namespace", 4: "Package", 5: "Class",
    6: "Method", 7: "Property", 8: "Field", 9: "Constructor", 10: "Enum",
    11: "Interface", 12: "Function", 13: "Variable", 14: "Constant", 15: "String",
    16: "Number", 17: "Boolean", 18: "Array", 19: "Object", 20: "Key",
    21: "Null", 22: "EnumMember", 23: "Struct", 24: "Event", 25: "Operator",
    26: "TypeParameter"
  };
  return kinds[kind] || "Unknown";
}

/**
 * Recursively counts document symbols.
 * Original: dg2 in chunks.119.mjs:354281
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
 * Extracts symbol name at a given position from file content.
 * Original: xg2 in chunks.119.mjs:3143-3172
 */
export function extractSymbolAtPosition(content: string, line: number, character: number): string | undefined {
  const lines = content.split(/\r?\n/);
  // Line is 1-based in input usually, need to check usage.
  // In mapToLspRequest we convert 1-based to 0-based.
  // Assuming 0-based here for internal utility, or aligned with `formatLocation`.
  // Wait, if it comes from user input/cursor, it might be 1-based.
  // But typically array access is 0-based.
  
  if (line < 0 || line >= lines.length) return undefined;
  
  const lineContent = lines[line];
  if (!lineContent) return undefined;
  
  if (character < 0 || character >= lineContent.length) return undefined;

  // Simple regex to find word at position
  // Look backward
  let start = character;
  while (start > 0 && /[\w\d_$]/.test(lineContent[start - 1] || '')) {
    start--;
  }
  
  // Look forward
  let end = character;
  while (end < lineContent.length && /[\w\d_$]/.test(lineContent[end] || '')) {
    end++;
  }
  
  if (start === end) return undefined;
  return lineContent.substring(start, end);
}

// ============================================
// Formatters
// ============================================

/**
 * Formats goToDefinition result.
 * Original: PU0 in chunks.119.mjs:353750
 */
function formatDefinition(result: any, cwd?: string): string {
  if (!result) return "No definition found. This may occur if the cursor is not on a symbol, or if the definition is in an external library not indexed by the LSP server.";
  
  if (Array.isArray(result)) {
    const locations = result.map(normalizeLocation);
    const validLocations = locations.filter(l => l && l.uri);
    
    if (validLocations.length === 0) return "No definition found. This may occur if the cursor is not on a symbol, or if the definition is in an external library not indexed by the LSP server.";
    
    if (validLocations.length === 1) return `Defined in ${formatLocation(validLocations[0]!, cwd)}`;
    
    const list = validLocations.map(l => `  ${formatLocation(l, cwd)}`).join('\n');
    return `Found ${validLocations.length} definitions:\n${list}`;
  }
  
  const loc = normalizeLocation(result);
  return `Defined in ${formatLocation(loc, cwd)}`;
}

/**
 * Formats findReferences result.
 * Original: Lg2 in chunks.119.mjs:353770
 */
function formatReferences(result: any, cwd?: string): string {
  const refs = (result || []) as LspLocation[];
  const validRefs = refs.filter(r => r && r.uri);
  
  if (validRefs.length === 0) return "No references found. This may occur if the symbol has no usages, or if the LSP server has not fully indexed the workspace.";
  
  if (validRefs.length === 1) return `Found 1 reference:\n  ${formatLocation(validRefs[0]!, cwd)}`;
  
  const groups = groupLocationsByFile(validRefs as any, cwd);
  const lines = [`Found ${validRefs.length} references across ${groups.size} files:`];
  
  for (const [file, locs] of groups) {
    lines.push(`\n${file}:`);
    for (const loc of locs) {
      const l = (loc as LspLocation);
      const line = l.range.start.line + 1;
      const char = l.range.start.character + 1;
      lines.push(`  Line ${line}:${char}`);
    }
  }
  return lines.join('\n');
}

/**
 * Formats hover contents.
 * Original: Ul5 in chunks.119.mjs:353795
 */
function formatHoverContents(contents: any): string {
  if (Array.isArray(contents)) {
    return contents.map(c => {
      if (typeof c === 'string') return c;
      return c.value;
    }).join('\n\n');
  }
  if (typeof contents === 'string') return contents;
  if ('kind' in contents) return contents.value;
  return String(contents);
}

/**
 * Formats hover result.
 * Original: Og2 in chunks.119.mjs:353807
 */
function formatHover(result: any, cwd?: string): string {
  if (!result) return "No hover information available. This may occur if the cursor is not on a symbol, or if the LSP server has not fully indexed the file.";
  
  const contents = formatHoverContents(result.contents);
  if (result.range) {
    const line = result.range.start.line + 1;
    const char = result.range.start.character + 1;
    return `Hover info at ${line}:${char}:\n\n${contents}`;
  }
  return contents;
}

/**
 * Helper for document symbol recursion.
 * Original: Mg2 in chunks.119.mjs:353851
 */
function formatSymbolRecursive(symbol: LspDocumentSymbol, depth: number = 0): string[] {
  const lines: string[] = [];
  const indent = "  ".repeat(depth);
  const kind = symbolKindToName(symbol.kind);
  let line = `${indent}${symbol.name} (${kind})`;
  
  if (symbol.detail) line += ` ${symbol.detail}`;
  
  const lineNum = symbol.range.start.line + 1;
  line += ` - Line ${lineNum}`;
  
  lines.push(line);
  
  if (symbol.children && symbol.children.length > 0) {
    for (const child of symbol.children) {
      lines.push(...formatSymbolRecursive(child, depth + 1));
    }
  }
  return lines;
}

/**
 * Formats document symbols.
 * Original: Rg2 in chunks.119.mjs:353863
 */
function formatDocumentSymbols(result: any, cwd?: string): string {
  const symbols = (result || []) as (LspDocumentSymbol | LspSymbolInformation)[];
  if (symbols.length === 0) return "No symbols found in document. This may occur if the file is empty, not supported by the LSP server, or if the server has not fully indexed the file.";
  
  // Handle SymbolInformation (flat list) vs DocumentSymbol (hierarchy)
  const first = symbols[0];
  if (first && 'location' in first) {
    return formatWorkspaceSymbols(result, cwd);
  }
  
  const docSymbols = symbols as LspDocumentSymbol[];
  const lines = ["Document symbols:"];
  for (const sym of docSymbols) {
    lines.push(...formatSymbolRecursive(sym));
  }
  return lines.join('\n');
}

/**
 * Formats workspace symbols.
 * Original: SU0 in chunks.119.mjs:353873
 */
function formatWorkspaceSymbols(result: any, cwd?: string): string {
  const symbols = (result || []) as LspSymbolInformation[];
  const validSymbols = symbols.filter(s => s && s.location && s.location.uri);
  
  if (validSymbols.length === 0) return "No symbols found in workspace. This may occur if the workspace is empty, or if the LSP server has not finished indexing the project.";
  
  const lines = [`Found ${validSymbols.length} symbol${validSymbols.length === 1 ? '' : 's'} in workspace:`];
  const groups = groupLocationsByFile(validSymbols, cwd);
  
  for (const [file, items] of groups) {
    lines.push(`\n${file}:`);
    for (const item of items) {
      const sym = item as LspSymbolInformation;
      const kind = symbolKindToName(sym.kind);
      const line = sym.location.range.start.line + 1;
      let text = `  ${sym.name} (${kind}) - Line ${line}`;
      if (sym.containerName) text += ` in ${sym.containerName}`;
      lines.push(text);
    }
  }
  return lines.join('\n');
}

/**
 * Formats a call hierarchy item.
 * Original: Ng2 in chunks.119.mjs:353898
 */
function formatCallHierarchyItem(item: LspCallHierarchyItem, cwd?: string): string {
  if (!item.uri) return `${item.name} (${symbolKindToName(item.kind)}) - <unknown location>`;
  
  const file = uriToRelativePath(item.uri, cwd);
  const line = item.range.start.line + 1;
  const kind = symbolKindToName(item.kind);
  let text = `${item.name} (${kind}) - ${file}:${line}`;
  if (item.detail) text += ` [${item.detail}]`;
  return text;
}

/**
 * Formats prepareCallHierarchy result.
 * Original: _g2 in chunks.119.mjs:353910
 */
function formatCallHierarchyPrepare(result: any, cwd?: string): string {
  const items = (result || []) as LspCallHierarchyItem[];
  if (items.length === 0) return "No call hierarchy item found at this position";
  
  if (items.length === 1) return `Call hierarchy item: ${formatCallHierarchyItem(items[0]!, cwd)}`;
  
  const lines = [`Found ${items.length} call hierarchy items:`];
  for (const item of items) {
    lines.push(`  ${formatCallHierarchyItem(item, cwd)}`);
  }
  return lines.join('\n');
}

/**
 * Formats incoming calls.
 * Original: jg2 in chunks.119.mjs:353919
 */
function formatIncomingCalls(result: any, cwd?: string): string {
  const calls = (result || []) as LspIncomingCall[];
  if (calls.length === 0) return "No incoming calls found (nothing calls this function)";
  
  const lines = [`Found ${calls.length} incoming call${calls.length === 1 ? '' : 's'}:`];
  const groups = new Map<string, LspIncomingCall[]>();
  
  for (const call of calls) {
    if (!call.from) continue;
    const file = uriToRelativePath(call.from.uri, cwd);
    if (!groups.has(file)) groups.set(file, []);
    groups.get(file)!.push(call);
  }
  
  for (const [file, items] of groups) {
    lines.push(`\n${file}:`);
    for (const item of items) {
      if (!item.from) continue;
      const kind = symbolKindToName(item.from.kind);
      const line = item.from.range.start.line + 1;
      let text = `  ${item.from.name} (${kind}) - Line ${line}`;
      
      if (item.fromRanges && item.fromRanges.length > 0) {
        const ranges = item.fromRanges.map(r => `${r.start.line + 1}:${r.start.character + 1}`).join(', ');
        text += ` [calls at: ${ranges}]`;
      }
      lines.push(text);
    }
  }
  return lines.join('\n');
}

/**
 * Formats outgoing calls.
 * Original: Tg2 in chunks.119.mjs:353954
 */
function formatOutgoingCalls(result: any, cwd?: string): string {
  const calls = (result || []) as LspOutgoingCall[];
  if (calls.length === 0) return "No outgoing calls found (this function calls nothing)";
  
  const lines = [`Found ${calls.length} outgoing call${calls.length === 1 ? '' : 's'}:`];
  const groups = new Map<string, LspOutgoingCall[]>();
  
  for (const call of calls) {
    if (!call.to) continue;
    const file = uriToRelativePath(call.to.uri, cwd);
    if (!groups.has(file)) groups.set(file, []);
    groups.get(file)!.push(call);
  }
  
  for (const [file, items] of groups) {
    lines.push(`\n${file}:`);
    for (const item of items) {
      if (!item.to) continue;
      const kind = symbolKindToName(item.to.kind);
      const line = item.to.range.start.line + 1;
      let text = `  ${item.to.name} (${kind}) - Line ${line}`;
      
      if (item.fromRanges && item.fromRanges.length > 0) {
        const ranges = item.fromRanges.map(r => `${r.start.line + 1}:${r.start.character + 1}`).join(', ');
        text += ` [called from: ${ranges}]`;
      }
      lines.push(text);
    }
  }
  return lines.join('\n');
}

// ============================================
// Core Functions
// ============================================

/**
 * Maps LspOperationInput to an LSP JSON-RPC request.
 * Original: Rl5 in chunks.119.mjs:354191-354408
 */
export function mapToLspRequest(input: LspOperationInput, filePath: string): LspRequest {
  const uri = `file://${filePath}`;
  // Convert 1-based to 0-based for LSP
  const position = {
    line: input.line - 1,
    character: input.character - 1
  };

  switch (input.operation) {
    case 'goToDefinition':
      return {
        method: LSP_CONSTANTS.METHODS.TEXT_DOCUMENT_DEFINITION,
        params: {
          textDocument: { uri },
          position
        }
      };
    case 'findReferences':
      return {
        method: LSP_CONSTANTS.METHODS.TEXT_DOCUMENT_REFERENCES,
        params: {
          textDocument: { uri },
          position,
          context: { includeDeclaration: true }
        }
      };
    case 'hover':
      return {
        method: LSP_CONSTANTS.METHODS.TEXT_DOCUMENT_HOVER,
        params: {
          textDocument: { uri },
          position
        }
      };
    case 'documentSymbol':
      return {
        method: LSP_CONSTANTS.METHODS.TEXT_DOCUMENT_DOCUMENT_SYMBOL,
        params: {
          textDocument: { uri }
        }
      };
    case 'workspaceSymbol':
      return {
        method: 'workspace/symbol',
        params: {
          query: '' // Empty query to get all symbols? Or input should have it? The source passes empty string.
        }
      };
    case 'goToImplementation':
      return {
        method: 'textDocument/implementation',
        params: {
          textDocument: { uri },
          position
        }
      };
    case 'prepareCallHierarchy':
    case 'incomingCalls':
    case 'outgoingCalls':
      // All three initially map to prepareCallHierarchy to get the item
      return {
        method: 'textDocument/prepareCallHierarchy',
        params: {
          textDocument: { uri },
          position
        }
      };
    default:
      throw new Error(`Unsupported operation: ${input.operation}`);
  }
}

/**
 * Formats the result of an LSP operation.
 * Original: jl5 in chunks.119.mjs:354304-354518
 */
export function formatLspResult(
  operation: LspOperation,
  result: any,
  cwd: string
): { formatted: string; resultCount: number; fileCount: number } {
  
  switch (operation) {
    case 'goToDefinition': {
      const locations = (Array.isArray(result) ? result : result ? [result] : []).map(normalizeLocation);
      const validLocations = locations.filter(x => x && x.uri);
      return {
        formatted: formatDefinition(result, cwd),
        resultCount: validLocations.length,
        fileCount: countUniqueFiles(validLocations)
      };
    }
    case 'findReferences': {
      const validRefs = (result || []).filter((r: any) => r && r.uri);
      return {
        formatted: formatReferences(result, cwd),
        resultCount: validRefs.length,
        fileCount: countUniqueFiles(validRefs)
      };
    }
    case 'hover': {
      return {
        formatted: formatHover(result, cwd),
        resultCount: result ? 1 : 0,
        fileCount: result ? 1 : 0
      };
    }
    case 'documentSymbol': {
      const symbols = result || [];
      const count = (symbols.length > 0 && symbols[0].range) 
        ? countDocumentSymbols(symbols as LspDocumentSymbol[]) 
        : symbols.length;
      return {
        formatted: formatDocumentSymbols(result, cwd),
        resultCount: count,
        fileCount: symbols.length > 0 ? 1 : 0
      };
    }
    case 'workspaceSymbol': {
      const validSymbols = (result || []).filter((s: any) => s && s.location && s.location.uri);
      const locations = validSymbols.map((s: any) => s.location);
      return {
        formatted: formatWorkspaceSymbols(result, cwd),
        resultCount: validSymbols.length,
        fileCount: countUniqueFiles(locations)
      };
    }
    case 'goToImplementation': {
      const locations = (Array.isArray(result) ? result : result ? [result] : []).map(normalizeLocation);
      const validLocations = locations.filter(x => x && x.uri);
      return {
        formatted: formatDefinition(result, cwd), // Uses same formatter as definition
        resultCount: validLocations.length,
        fileCount: countUniqueFiles(validLocations)
      };
    }
    case 'prepareCallHierarchy': {
      const items = result || [];
      return {
        formatted: formatCallHierarchyPrepare(result, cwd),
        resultCount: items.length,
        fileCount: items.length > 0 ? countUniqueFiles(items) : 0
      };
    }
    case 'incomingCalls': {
      const items = result || [];
      const fromUris = items.map((i: any) => ({ uri: i.from?.uri })).filter((i: any) => i.uri);
      return {
        formatted: formatIncomingCalls(result, cwd),
        resultCount: items.length,
        fileCount: items.length > 0 ? countUniqueFiles(fromUris) : 0
      };
    }
    case 'outgoingCalls': {
      const items = result || [];
      const toUris = items.map((i: any) => ({ uri: i.to?.uri })).filter((i: any) => i.uri);
      return {
        formatted: formatOutgoingCalls(result, cwd),
        resultCount: items.length,
        fileCount: items.length > 0 ? countUniqueFiles(toUris) : 0
      };
    }
    default:
      return {
        formatted: `Unknown operation: ${operation}`,
        resultCount: 0,
        fileCount: 0
      };
  }
}
