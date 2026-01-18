/**
 * Symbol Find Tool
 *
 * Search for symbols by pattern.
 * Usage: pnpm symbol:find <pattern>
 */

import { loadAllSymbols, searchSymbols, type SymbolMapping } from './symbol-lookup.js';

function formatTable(mappings: SymbolMapping[]): string {
  if (mappings.length === 0) {
    return 'No symbols found';
  }

  const lines: string[] = [];
  lines.push('| Obfuscated | Readable | File:Line | Type | Module |');
  lines.push('|------------|----------|-----------|------|--------|');

  for (const m of mappings) {
    const fileLine = m.line ? `${m.file}:${m.line}` : m.file;
    lines.push(`| ${m.obfuscated} | ${m.readable} | ${fileLine} | ${m.type} | ${m.module} |`);
  }

  return lines.join('\n');
}

// CLI entry point
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: pnpm symbol:find <pattern>');
  console.log('Example: pnpm symbol:find create*');
  console.log('Example: pnpm symbol:find *State*');
  process.exit(1);
}

const pattern = args[0];
console.log(`Loading symbol index...`);
const symbols = loadAllSymbols();
console.log(`Loaded ${symbols.size} symbols\n`);

const results = searchSymbols(pattern, symbols);
console.log(`Found ${results.length} symbols matching "${pattern}":\n`);

if (results.length > 50) {
  console.log(formatTable(results.slice(0, 50)));
  console.log(`\n... and ${results.length - 50} more. Use a more specific pattern.`);
} else {
  console.log(formatTable(results));
}
