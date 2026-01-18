/**
 * Symbol Chunk Tool
 *
 * List all symbols from a specific chunk file.
 * Usage: pnpm symbol:chunk <chunk_number>
 */

import { loadAllSymbols, getSymbolsFromChunk, type SymbolMapping } from './symbol-lookup.js';

function formatTable(mappings: SymbolMapping[]): string {
  if (mappings.length === 0) {
    return 'No symbols found';
  }

  const lines: string[] = [];
  lines.push('| Obfuscated | Readable | Line | Type |');
  lines.push('|------------|----------|------|------|');

  for (const m of mappings) {
    lines.push(`| ${m.obfuscated} | ${m.readable} | ${m.line} | ${m.type} |`);
  }

  return lines.join('\n');
}

// CLI entry point
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: pnpm symbol:chunk <chunk_number>');
  console.log('Example: pnpm symbol:chunk 135');
  process.exit(1);
}

const chunkNumber = args[0];
console.log(`Loading symbol index...`);
const symbols = loadAllSymbols();
console.log(`Loaded ${symbols.size} symbols\n`);

const chunkSymbols = getSymbolsFromChunk(chunkNumber, symbols);
console.log(`Found ${chunkSymbols.length} symbols in chunks.${chunkNumber}.mjs:\n`);
console.log(formatTable(chunkSymbols));
