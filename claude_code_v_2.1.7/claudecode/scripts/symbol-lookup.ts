/**
 * Symbol Lookup Tool
 *
 * Parse symbol index markdown files and provide lookup functionality.
 * Usage: pnpm symbol:lookup <obfuscated_name>
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ANALYZE_DIR = join(__dirname, '../../analyze/00_overview');

export interface SymbolMapping {
  obfuscated: string;
  readable: string;
  file: string;
  line: string;
  type: string;
  module: string;
  category: string;
}

const SYMBOL_INDEX_FILES = [
  { file: 'symbol_index_core_execution.md', category: 'core-execution' },
  { file: 'symbol_index_core_features.md', category: 'core-features' },
  { file: 'symbol_index_infra_platform.md', category: 'infra-platform' },
  { file: 'symbol_index_infra_integration.md', category: 'infra-integration' },
];

/**
 * Parse a markdown table row into symbol mapping
 */
function parseTableRow(row: string, module: string, category: string): SymbolMapping | null {
  // Skip header rows and separator rows
  if (row.startsWith('|--') || row.includes('Obfuscated') || row.includes('-------')) {
    return null;
  }

  // Parse: | obfuscated | readable | file:line | type |
  const parts = row.split('|').map(p => p.trim()).filter(p => p);
  if (parts.length < 4) {
    return null;
  }

  const [obfuscated, readable, fileLine, type] = parts;

  // Skip invalid entries
  if (!obfuscated || !readable || obfuscated === 'Obfuscated') {
    return null;
  }

  // Parse file:line format
  const fileLineMatch = fileLine?.match(/^([^:]+):?(.*)?$/);
  const file = fileLineMatch?.[1] || fileLine || '';
  const line = fileLineMatch?.[2] || '';

  return {
    obfuscated,
    readable,
    file,
    line,
    type: type || 'unknown',
    module,
    category,
  };
}

/**
 * Parse a symbol index markdown file
 */
function parseSymbolIndex(content: string, category: string): SymbolMapping[] {
  const mappings: SymbolMapping[] = [];
  let currentModule = 'unknown';

  const lines = content.split('\n');
  for (const line of lines) {
    // Track current module from ## headers
    const moduleMatch = line.match(/^##\s+(?:Module:\s*)?(.+)$/);
    if (moduleMatch) {
      currentModule = moduleMatch[1].trim();
      continue;
    }

    // Parse table rows
    if (line.startsWith('|') && line.includes('|')) {
      const mapping = parseTableRow(line, currentModule, category);
      if (mapping) {
        mappings.push(mapping);
      }
    }
  }

  return mappings;
}

/**
 * Load all symbol mappings from index files
 */
export function loadAllSymbols(): Map<string, SymbolMapping> {
  const symbolMap = new Map<string, SymbolMapping>();

  for (const { file, category } of SYMBOL_INDEX_FILES) {
    try {
      const filePath = join(ANALYZE_DIR, file);
      const content = readFileSync(filePath, 'utf-8');
      const mappings = parseSymbolIndex(content, category);

      for (const mapping of mappings) {
        // Store by obfuscated name
        symbolMap.set(mapping.obfuscated, mapping);
      }
    } catch (error) {
      console.error(`Warning: Could not load ${file}:`, error);
    }
  }

  return symbolMap;
}

/**
 * Create reverse lookup map (readable -> obfuscated)
 */
export function createReverseLookup(symbols: Map<string, SymbolMapping>): Map<string, SymbolMapping> {
  const reverseMap = new Map<string, SymbolMapping>();
  for (const mapping of symbols.values()) {
    reverseMap.set(mapping.readable, mapping);
  }
  return reverseMap;
}

/**
 * Lookup a single symbol
 */
export function lookupSymbol(name: string, symbols: Map<string, SymbolMapping>): SymbolMapping | undefined {
  // Try direct lookup
  let result = symbols.get(name);
  if (result) return result;

  // Try case-insensitive search
  for (const [key, mapping] of symbols) {
    if (key.toLowerCase() === name.toLowerCase()) {
      return mapping;
    }
  }

  return undefined;
}

/**
 * Search symbols by pattern
 */
export function searchSymbols(pattern: string, symbols: Map<string, SymbolMapping>): SymbolMapping[] {
  const results: SymbolMapping[] = [];
  const regex = new RegExp(pattern.replace(/\*/g, '.*'), 'i');

  for (const mapping of symbols.values()) {
    if (regex.test(mapping.obfuscated) || regex.test(mapping.readable)) {
      results.push(mapping);
    }
  }

  return results;
}

/**
 * Get all symbols from a specific chunk file
 */
export function getSymbolsFromChunk(chunkNumber: number | string, symbols: Map<string, SymbolMapping>): SymbolMapping[] {
  const chunkFile = `chunks.${chunkNumber}.mjs`;
  const results: SymbolMapping[] = [];

  for (const mapping of symbols.values()) {
    if (mapping.file === chunkFile || mapping.file.startsWith(`chunks.${chunkNumber}`)) {
      results.push(mapping);
    }
  }

  return results.sort((a, b) => {
    const lineA = parseInt(a.line.split('-')[0]) || 0;
    const lineB = parseInt(b.line.split('-')[0]) || 0;
    return lineA - lineB;
  });
}

/**
 * Format symbol for display
 */
function formatSymbol(mapping: SymbolMapping): string {
  return `${mapping.obfuscated} -> ${mapping.readable}
  File: ${mapping.file}:${mapping.line}
  Type: ${mapping.type}
  Module: ${mapping.module}
  Category: ${mapping.category}`;
}

// CLI entry point
if (process.argv[1]?.includes('symbol-lookup')) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: pnpm symbol:lookup <obfuscated_name>');
    console.log('Example: pnpm symbol:lookup HzA');
    process.exit(1);
  }

  const name = args[0];
  console.log(`Loading symbol index...`);
  const symbols = loadAllSymbols();
  console.log(`Loaded ${symbols.size} symbols\n`);

  const result = lookupSymbol(name, symbols);

  if (result) {
    console.log('Found symbol:\n');
    console.log(formatSymbol(result));
  } else {
    // Try searching
    const searchResults = searchSymbols(name, symbols);
    if (searchResults.length > 0) {
      console.log(`No exact match for "${name}", but found ${searchResults.length} similar symbols:\n`);
      for (const sr of searchResults.slice(0, 10)) {
        console.log(formatSymbol(sr));
        console.log('---');
      }
      if (searchResults.length > 10) {
        console.log(`... and ${searchResults.length - 10} more`);
      }
    } else {
      console.log(`Symbol "${name}" not found in index`);
    }
  }
}
